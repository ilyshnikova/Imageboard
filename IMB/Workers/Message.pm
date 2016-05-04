package IMB::Workers::Message;

use strict;
use warnings;
use utf8;

use Data::Dumper;

use IMB::UploadFile;
use base 'IMB::WorkerBase';

sub add_message {
	my $self = shift;
	my $data = shift;

	my ($text, $user_hash, $board_id) = map {$data->{$_}} 'text', 'user_hash', 'board_id';

	my $image = 0;

	if ($data->{'files'}->[0]) {
		$image = 1;
	}

	$self->{'dbh'}->do("
		lock table
			Messages
		write
	");

	my ($max_id) = $self->{'dbh'}->selectrow_array("
		select
			ifnull(max(Id), 0)
		from
			Messages
	");

	my $new_id = $max_id + 1;

	$self->{'dbh'}->do("
		insert into
			Messages(Id, BoardId, Message, UserHash, ParentMessageId, Time, Image)
		values
			(
				$new_id, $board_id, " . $self->{'dbh'}->quote($text) . ", " . $self->{'dbh'}->quote($user_hash) . ", 0, now(), $image
			)
	");


	if ($image) {
		IMB::UploadFile::upload_file(
			$data->{'files'}->[0]->{'fh'},
			"/var/www/imageboard/public/messages_images/" . $new_id . ".png"
		);
	}

	$self->{'dbh'}->do("
		unlock tables
	");


	return $new_id;
}


sub delete_messages {
	my $self = shift;
	my $data = shift;

	my ($condition, $user_hash) = map {$data->{$_}} 'condition', 'user_hash';


	$self->{'dbh'}->do("
		lock tables
			Messages write,
			Users write
	");

	my $message_information = $self->get_messages($data);

	if (
		$user_hash eq $message_information->[0]->{'UserHash'}
		&& $self->get_user_datails($user_hash)->{'Mode'}
	) {

		if (scalar($message_information)) {
			$self->{'dbh'}->do("delete from Messages where " . $condition);

			if ($message_information->[0]->{'Image'}) {
				`rm /var/www/imageboard/public/messages_images/$message_information->[0]->{'Id'}.png`;
			}
		}
	}
	$self->{'dbh'}->do("
		unlock tables
	");


	return 1;
}


sub get_messages {
	my $self = shift;
	my $data = shift;

	my $condition = $data->{'condition'};

	return $self->{'dbh'}->selectall_arrayref("
		select
			Messages.Id as Id,
			convert(Messages.Message using utf8) as Message,
			Messages.ParentMessageId as ParentMessageId,
			unix_timestamp(Messages.Time) as Time,
			Messages.Image as Image,
			Users.Name as UserName,
			Users.Hash as UserHash
		from
			Messages
		inner join
			Users on Messages.UserHash = Users.Hash
		where
			$condition
	", {Slice => {}});
}


sub visitors_updater {
	my $self = shift;
       	my $board_id = shift;
	my $user_hash = shift;

	$self->{'dbh'}->do("
		insert into
			BoardsVisitors(LastVisitTime, UserHash, BoardId)
		values
			 (now(), " . $self->{'dbh'}->quote($user_hash)  . ", $board_id)
		on duplicate key update
			LastVisitTime=now()
	");
}


sub get_number_of_board_visitors {
	my $self = shift;
	my $board_id = shift;

	$self->{'dbh'}->do("
		delete from
			BoardsVisitors
		where
			LastVisitTime < now() - 300

	");

	return  $self->{'dbh'}->selectrow_array("
		select
			count(*)
		from
			BoardsVisitors
		where
			BoardId=" . $board_id  . " and
			LastVisitTime + 300 > now()
	");
}


sub respond {
	my $self = shift;
	my $data = shift;


	if ($data->{'type'} eq 'add') {
		my $new_id = $self->add_message($data);
		return {'message_id' => $new_id};
	} elsif ($data->{'type'} eq 'get') {
		return $self->get_messages($data);
	} elsif ($data->{'type'} eq 'delete') {
		return $self->delete_messages($data);
	} elsif ($data->{'type'} eq 'get_messages_for_board') {
		$self->visitors_updater($data->{'board_id'}, $data->{'user_hash'});
		return {
			'Messages' =>  $self->get_messages($data),
			'BoardsVisitors' => $self->get_number_of_board_visitors($data->{'board_id'}),
		};
	} else {
		die "incorrect type";
	}
}

1;

