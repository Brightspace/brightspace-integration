#!/usr/bin/python3

import os
import json
import unbundle
import unittest

from unbundle import READ
from unbundle import POLYMER
from unbundle import IMPORT_STYLE
from unbundle import IMPORT_STYLE_ESM
from unbundle import RELATIVE_PATH_CONFIG

# Constants
TEST_INSTANCE_NAME = "unbundle-test"
CURRENT_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_INSTANCE_LOCATION = os.path.join(CURRENT_SCRIPT_DIR, "test-folder")
TEST_DIRECTORY_TO_REMOVE = os.path.join(TEST_INSTANCE_LOCATION, TEST_INSTANCE_NAME, "sample-dir")
TEST_DIRECTORY_TO_NAVIGATE = os.path.join(TEST_INSTANCE_LOCATION, TEST_INSTANCE_NAME, "sample-dir2")


class TestUnbundler(unittest.TestCase):

    # Setup for the test cases
    def setUp(self):
        self.test_unbundler = unbundle.Unbundler(
            bsi_path=CURRENT_SCRIPT_DIR,
            component_path="",
            instance_path=TEST_INSTANCE_LOCATION,
            web_server_path="",
            instance_name=TEST_INSTANCE_NAME,
            test=True
        )        

    def test_modify_config_file(self):
        self.test_unbundler.modify_config_file()
        
        expected_data = {
            POLYMER: "",
            IMPORT_STYLE: IMPORT_STYLE_ESM,
            "env": "dev"
        }

        actual_data = {}
        with open(os.path.join(TEST_INSTANCE_LOCATION, TEST_INSTANCE_NAME, RELATIVE_PATH_CONFIG), READ) as data_file:
            actual_data = json.load(data_file)

        self.assertEqual(expected_data, actual_data)

    def test_remove_dir(self):
        # Check that the sample directory is there
        self.assertTrue(os.path.exists(TEST_DIRECTORY_TO_REMOVE))

        # Remove it and check that it is gone
        self.test_unbundler.remove_dir(TEST_DIRECTORY_TO_REMOVE)
        self.assertFalse(os.path.exists(TEST_DIRECTORY_TO_REMOVE))        

    def test_run_command(self):
        # Check that npm is installed and we can get some output
        self.assertNotEqual(self.test_unbundler.run_command("npm -v"), "")

    def test_change_dir(self):
        # Check that the sample directory 2 is there
        self.assertTrue(os.path.exists(TEST_DIRECTORY_TO_NAVIGATE))

        # Check that navigating to the directory worked
        self.test_unbundler.change_dir(TEST_DIRECTORY_TO_NAVIGATE)
        self.assertEqual(os.getcwd(), TEST_DIRECTORY_TO_NAVIGATE)      

    # Cleanup after the test cases are done.
    def tearDown(self):
        # Restore the directory for the next run of these test case
        if not os.path.exists(TEST_DIRECTORY_TO_REMOVE):
            os.mkdir(TEST_DIRECTORY_TO_REMOVE)


if __name__ == '__main__':
    unittest.main()
