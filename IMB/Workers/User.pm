package IMB::Workers::User;

use strict;
use warnings;
use utf8;

use base 'IMB::WorkerBase';

sub add_user{
	my $self = shift;
	my $data = shift;

	my ($user_hash, $user_name) = map {$data->{$_}} 'user_hash', 'user_name';

	$self->{'dbh'}->do("
		lock table
			Users
		write
	");

	my ($max_id) = $self->{'dbh'}->selectrow_array("
		select
			ifnull(max(Id), 0)
		from
			Users
	");

	my $new_user_id = $max_id + 1;

	$self->{'dbh'}->do("
		insert into
			Users(Hash, Id, Name)
		values
			(
				" . $self->{'dbh'}->quote($user_hash) . ", $new_user_id," . $self->{'dbh'}->quote($user_name) . "
			)
	");

	$self->{'dbh'}->do("
		unlock tables
	");
}


sub get_by_name {
	my $self = shift;
	my $data = shift;

	return $self->{'dbh'}->selectrow_hashref("
		select
			Id
		from
			Users
		where
			Name  = " . $self->{'dbh'}->quote($data->{'user_name'}) . "
	") || {};

}


sub respond {
	my $self = shift;
	my $data = shift;

	if ($data->{'type'} eq 'get') {
		return $self->get_user_datails($data->{'user_hash'});
	} elsif ($data->{'type'} eq 'add') {
		$self->add_user($data);
		return {};
	} elsif ($data->{'type'} eq 'get_by_name') {
		$self->get_by_name($data);
	} else {
		die "unknown type";
	}
}

1;
