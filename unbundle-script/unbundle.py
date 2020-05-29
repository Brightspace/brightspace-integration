#!/usr/bin/python3

import os
import sys
import time
import json
import ctypes
import shutil
import argparse
import subprocess

# Constants
READ = "r"
WRITE = "w"

NAME = "name"
WINDOWS = "nt"
ERROR_CODE = 1
POLYMER = "polymer-3"
PACKAGE = "package.json"
IMPORT_STYLE_ESM = "esm"
IMPORT_STYLE = "import-style"
LOCALHOST = "http://localhost:8080/"

DEFAULT_LMS_INSTANCE = "lsone"
PATH_TO_LMS = os.path.join("C:\\", "D2L", "instances")
CURRENT_BSI_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RELATIVE_PATH_CONFIG = os.path.join("config", "Infrastructure", "D2L.LP.Web.UI.Html.Bsi.config.json")


class Unbundler:

    # Constructor
    def __init__(
        self,
        bsi_path,
        component_path,
        instance_path,
        web_server_path,
        instance_name,
        front_end_only=False,
        back_end_only=False,
        dry=False,
        test=False
    ):
        # Are we doing all the commands or a subset?
        self.all_commands = not front_end_only and not back_end_only
        self.front_end_only = front_end_only
        self.back_end_only = back_end_only

        # Are we doing a dry run?
        self.dry_run = dry

        # Set the path to the repos, the component name and paths
        self.bsi_repo_dir = bsi_path
        self.component_repo_dir = component_path
        self.path_to_lms = instance_path
        self.web_server_path = web_server_path

        self.test = test

        if not self.test and not self.dry_run:
            # Check that the BSI path and the component path are actually node modules
            if not self.back_end_only and (not self.is_node_module(bsi_path) or not self.is_node_module(component_path)):
                print("[ERROR] The given paths are not valid node modules!", file=sys.stderr)
                exit(ERROR_CODE)

            # Get the component package name
            with open(os.path.join(self.component_repo_dir, PACKAGE), READ) as data_file:
                self.component_name = json.load(data_file)[NAME]
        else:
            self.component_name=""
        
        # Get the path to the LMS
        self.path_to_lms = os.path.join(self.path_to_lms, instance_name)

    # Modifies the config file for the desired LMS.
    def modify_config_file(self):
        self.print_cmd("Update LMS config, located at: {}.".format(RELATIVE_PATH_CONFIG))        
        if not self.dry_run:
            with open(os.path.join(self.path_to_lms, RELATIVE_PATH_CONFIG), WRITE) as data_file:
                data = {}

                data[POLYMER] = self.web_server_path
                data[IMPORT_STYLE] = IMPORT_STYLE_ESM
                data["env"] = "dev"

                json.dump(data, data_file)

    # Run the given command
    def print_cmd(self, command):
        print("[COMMAND] {}".format(command))

    # Removes a directory given the path to the directory
    def remove_dir(self, path):
        self.print_cmd("rm -rf " + path)
        if not self.dry_run:
            if os.name == WINDOWS:
                os.system("rmdir {} /S /Q".format(path))
            else:
                shutil.rmtree(path)

    # Run a command and print it
    def run_command(self, command):
            self.print_cmd(command)
            if not self.dry_run:
                if not self.test:
                    os.system(command)
                else:
                    return subprocess.check_output(command, shell=True)

    # Change directory and print it
    def change_dir(self, path):
        self.print_cmd("cd {}".format(path))
        if not self.dry_run:
            os.chdir(path)
    
    # Check if the script is running as admin
    @staticmethod
    def is_admin():
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

    # Check if the given paths are actually node modules
    @staticmethod
    def is_node_module(path):
        return os.path.exists(os.path.join(path, PACKAGE))

    # Perform the unbundling process
    def unbundle(self):
        start_time = time.time()

        if os.name == WINDOWS and not self.is_admin() and not self.dry_run:
            print("[ERROR] The script must be run with elevated privileges...", file=sys.stderr)

            end_time = time.time()
            print()
            print("FAILURE")
            print("TOTAL TIME: {}".format(end_time-start_time))

            exit(ERROR_CODE)

        if self.all_commands or self.front_end_only:
            # Go to BSI
            self.change_dir(self.bsi_repo_dir)

            # Delete .npmrc
            try:
                self.print_cmd("rm .npmrc")
                os.remove(".npmrc")
            except:
                pass

            # Delete node_modules
            self.remove_dir("node_modules")

            # Install BSI
            self.run_command("npm i")

            # Run BSI build
            self.run_command("npm run build")

            # Go into component repo
            self.change_dir(self.component_repo_dir)

            # Run npm link in component
            self.run_command("npm link")

            # Go back to BSI
            self.change_dir(self.bsi_repo_dir)

            # npm link component
            self.run_command("npm link {}".format(self.component_name))

            # Delete component in node_modules
            self.remove_dir(os.path.join("node_modules", self.component_name, "node_modules"))

        if self.all_commands or self.back_end_only:
            # Modify BSI config file
            self.modify_config_file()

            # Restart iis
            self.run_command("iisreset")

        if not self.dry_run:
            print("Done! All you need to do now is run `npm start` in your BSI directory and visit your local LMS on the web.")
            
            end_time = time.time()
            print()
            print("SUCCESS")
            print("TOTAL TIME: {}".format(end_time-start_time))


# Parse the command line arguments
def get_params():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-cp",
        "--component-path",
        help="The path to the BSI component you are interested in unbundling.",
        required=True
    )
    
    parser.add_argument(
        "--bsi-path",
        help="The path to your BSI repo, the default is the directory of this script.",
        default=CURRENT_BSI_DIRECTORY
    )
    
    parser.add_argument(
        "--instance-path",
        help="The path to your LMS instances, if it differs from `{}`.".format(PATH_TO_LMS),
        default=PATH_TO_LMS
    )

    parser.add_argument(
        "--web-server-path",
        help="The path to the node web server, if it differs from `{}`.".format(LOCALHOST),
        default=LOCALHOST
    )

    parser.add_argument(
        "--instance-name",
        help="The name of the LMS instance you are interested in unbundling, the default is `{}`.".format(DEFAULT_LMS_INSTANCE),
        default=DEFAULT_LMS_INSTANCE
    )

    group = parser.add_mutually_exclusive_group(
        required=False
    )
    group.add_argument(
        "-fe",
        "--front-end-only",
        help="Only unbundle the front-end components (useful if your LMS is on a different 'machine').",
        default=False,
        action="store_true"
    )
    group.add_argument(
        "-be",
        "--back-end-only",
        help="Only unbundle the back-end components (useful if your BSI is on a different 'machine').",
        default=False,
        action="store_true"
    )

    parser.add_argument(
        "-d",
        "--dry",
        help="Outputs the sequence of commands that will be run, without running them.",
        default=False,
        action="store_true"
    )

    return parser.parse_args()


# Main routine
def main():
    args = get_params()
    unbundler = Unbundler(
        args.bsi_path,
        args.component_path,
        args.instance_path,
        args.web_server_path,
        args.instance_name,
        args.front_end_only,
        args.back_end_only,
        args.dry
    )
    unbundler.unbundle()


# Main method
if __name__ == "__main__":
    main()
