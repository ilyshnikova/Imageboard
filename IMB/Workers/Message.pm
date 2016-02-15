package IMB::Workers::Message;

use strict;
use warnings;
use utf8;

use base 'IMB::WorkerBase';

sub add_message {
	my $self = shift;
	my $data = shift;

	my ($text) = map {$data->{$_}} 'text';

	$self->{'dbh'}->do("
		lock table Messages write
	");

	my ($max_id) = $self->{'dbh'}->selectrow_array("
		select ifnull(max(Id), 0) from Messages
	");

	my $new_id = $max_id + 1;

	$self->{'dbh'}->do("
		insert into
			Messages(Id, Message, UserId, ParentMessageId, Time)
		values
			($new_id,". $self->{'dbh'}->quote($text) . ", 0, 0, now())
	");

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
			Id,
			convert(Message using utf8) as Message,
			UserId,
			ParentMessageId,
			unix_timestamp(Time) as Time
		from
			Messages
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

