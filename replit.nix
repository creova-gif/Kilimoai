{ pkgs }: {
  deps = [
    pkgs.nodejs-20
    pkgs.nodePackages.npm
    pkgs.bash
  ];
}
