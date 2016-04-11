package IMB::UploadFile;

use strict;
use warnings;
use utf8;
use autodie qw(open);
use Data::Dumper;
use IMB::Logger qw(LOGGER);


sub upload_file {
	my $file_ifh = shift;
	my $file_name = shift;

	open(my $fh, '>', $file_name);
	while (my $line = <$file_ifh>) {
		print $fh $line;
	}

	close($fh);
}

1;

