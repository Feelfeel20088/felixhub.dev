{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        with pkgs;
        {
          devShells.default = mkShell {
            buildInputs = [ nodejs typescript ];
            shellHook = ''
                echo "If you want to compile TypeScript, just use \`tsc\`"
                
                # Check for package.json and run npm install if it exists
                if [ -f package.json ]; then
                echo "Installing node modules..."
                npm install
                echo "Starting felixhub.dev..."
                npm start
                else
                echo "No package.json found. You might want to reclone the repo."
                fi
            '';
          };
        }
      );
}