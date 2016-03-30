package IMB::Workers::Message;

use strict;
use warnings;
use utf8;

use IMB::UploadFile;
use base 'IMB::WorkerBase';

sub add_message {
	my $self = shift;
	my $data = shift;

	my ($text, $user_hash, $board_id) = map {$data->{$_}} 'text', 'user_hash', 'board_id';

	my $image = 0;

	if ($data->{'files'}) {
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
				$new_id, $board_id, " . $self->{'dbh'}->quote($text) . ", " . $self->{'dbh'}->quote($user_hash) . ", 0, now() , " . $image  . "
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
			Users.Name as UserName
		from
			Messages
		inner join
			Users on Messages.UserHash = Users.Hash
		where
			$condition
	", {Slice => {}});
}

sub respond {
	my $self = shift;
	my $data = shift;

	if ($data->{'type'} eq 'add') {
		my $new_id = $self->add_message($data);
		return {'message_id' => $new_id};
	} elsif ($data->{'type'} eq 'get') {
		return $self->get_messages($data);
	} else {
		die "incorrect type";
	}
}

1;

