package IMB::Logger;

use strict;
use warnings;

use POSIX qw(strftime);

sub decode_message {
	my $message = shift;

	if (utf8::is_utf8($message)) {
		$message = encode('utf8', $message);
	}

	return $message;
}

sub append_spaces {
	my $string = shift;
	my $length = shift;

	return $string . (' ' x ($length - length($string)));
}

sub get_date {
	return strftime("%Y/%m/%d %H:%M:%S", localtime(time()));
}

sub print_message {
	my $level = shift;
	my $caller = shift;
	my $message = shift;
	my $null_error = shift;

	my $print_to = *STDERR;

	my ($package, $filename, $line) = @$caller;
	$filename =~ s/\.\///g;
	if ($filename =~ /\/([^\/]+)$/) {
		$filename = $1;
	}
	unless (defined($message)) {
		print_message($level, $caller, "::UNDEF::");
		return 1;
	}
	my $lines_of_message = [split(/\n/, $message)];

	my $date = get_date();

	my $pid = append_spaces($$, 5);
	if (scalar(@$lines_of_message) == 1) {
		print $print_to decode_message("$date $pid [$level] " . append_spaces($filename, 25) . "::\tline " . append_spaces($line, 4) . "::  $message\n");
	} else {
		print $print_to decode_message("$date $pid [$level] " . append_spaces($filename, 25) . "::\tline " . append_spaces($line, 4) . "::  Multiline message:\n");
		foreach my $line_of_message (@$lines_of_message) {
			print $print_to decode_message("$date $pid [$level] >>>> $line_of_message\n");
		}
		print $print_to decode_message("$date $pid [$level] <<<< End of multiline message.\n");
	}

	return 1;
}

sub LOGGER {
	my $message = shift;

	print_message("LOGGER", [caller()], $message);
	return 1;
}

1;
