{
  description = "felixhub.dev website dev shell with Node.js, TypeScript, and npm start";

  inputs = {
    # Nixpkgs from NixOS unstable
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable"; 
  };

  outputs = { self, nixpkgs }: {
    # Define the default shell environment
    devShell.default = nixpkgs.lib.mkShell {
      buildInputs = [
        nixpkgs.nodejs       # Node.js
        nixpkgs.typescript   # TypeScript
      ];

      # Run `npm start` when the shell is entered
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
  };
}
