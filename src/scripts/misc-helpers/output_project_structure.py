import os

def list_files(startpath):
    # Walk through each directory in the provided start path
    for root, dirs, files in os.walk(startpath):
        # Exclude '.git' and '.idea' directory to avoid listing version control files
        dirs[:] = [d for d in dirs if d != '.git' and d != '.idea']

        # Calculate how deep the directory is relative to startpath
        level = root.replace(startpath, '').count(os.sep)

        # Create indentation based on the directory level
        indent = ' ' * 4 * (level)

        # Print the current directory path
        print(f"{indent}{os.path.basename(root)}/")

        # Create additional indentation for files under the directory
        subindent = ' ' * 4 * (level + 1)

        # Print each file in the current directory
        for f in files:
            print(f"{subindent}{f}")

if __name__ == "__main__":
    # Navigate up two directories to the project root from the script location
    project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

    # Call function to list files starting from the calculated project path
    list_files(project_path)
