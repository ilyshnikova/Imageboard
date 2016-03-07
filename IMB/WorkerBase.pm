package IMB::WorkerBase;

use utf8;
use strict;
use warnings;

sub new {
	my $class = shift;
	my $dbh = shift;

	my $self = bless({}, $class);
	$self->{'dbh'} = $dbh;

	return $self;
}

sub get_user_datails {
	my $self = shift;
	my $user_hash = shift;

	if ($user_hash) {
		return $self->{'dbh'}->selectrow_hashref("
			select
				*
			from
				Users
			where
				Hash = " . $self->{'dbh'}->quote($user_hash) . "
		") || {};
	} else {
		return {};
	}
}


1;

