package IMB::Workers::User

use warnings;
use strict;

use base 'IMB::WorkerBase';

sub get_user_datails {
	my $self = shift;
	my $user_hash = shift;

	return $self->{'dbh'}->selectrow_hashref("
		select
			*
		from
			Users
		where
			Hash = " . $self->{'dbh'}->quote($user_hash) . "
	");
}


