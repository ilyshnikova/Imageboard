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

1;

