{
  description = "Help to find scools for children";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = inputs:
    let
      overlay = final: prev: {
      };
      perSystem = system:
        let
          pkgs = import inputs.nixpkgs { inherit system; overlays = [ overlay ]; };
          mynode = pkgs.nodejs_20;
          stdenv = pkgs.stdenv;
          nodePackages = pkgs.nodePackages;
        in
        {
          devShell = stdenv.mkDerivation {
            name = "school-consultant";
            buildInputs = [
              mynode
              nodePackages.npm
            ];
            shellHook = ''
                export PATH="$PWD/node_modules/.bin/:$PATH"
                export NPM_PACKAGES="$HOME/.npm-packages"
            '';
          };
          defaultPackage = pkgs.school_consultant;
        };
    in
    { inherit overlay; } // inputs.flake-utils.lib.eachDefaultSystem perSystem;
}

