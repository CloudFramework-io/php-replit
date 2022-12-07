{ pkgs }: {
	deps = [
		pkgs.sudo
  pkgs.python39Full
  pkgs.php74Packages.composer
  pkgs.php74
	];
}