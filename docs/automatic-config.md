# Experimental: Automatic BSI Configuration

**Note:** this script only works when your local BSI is running on the same machine as your local LMS.

You can unbundle your build using the `unbundle.py` script located in the `unbundle-script` folder.

Make sure you have Python 3.X installed, if not, you can install it using chocolatey (for Windows).
```shell
choco install python3
```

Installing Python on Mac using Homebrew:
```
brew install python
```

Once you have Python installed, running the script is simple. To unbundle your BSI all you need to do is run the following command.
```shell
python unbundle-script/unbundle.py --component-path="<path of component to unbundle>"
```

For example, if I wanted to unbundle my Activities repo, the command could look like this.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities"
```

#### Advanced Script Usage

Running the script with only the `--component-path` argument makes some assumptions about your developer machine and setup. There are several optional arguments that can be passed to the script to make it work for your setup.

| Flag name            | Flag purpose                                                                                                                                                                     |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--bsi-path`           | Optional: This is the full-path to your BSI repo. If not passed, the script assumes the location of the script as the BSI repo.                                                  |
| `-cp`/`--component-path`     | Required: This is the full-path to the component you want to unbundle.                                                                                                           |
| `--instance-path`      | Optional: This is the full-path to your LMS instances. If not passed, defaults to `C:\D2L\instances`.                                                                            |
| `--web-server-path`    | Optional: This is the path of your BSI node web server. If not passed, defaults to `http://localhost:8080`.                                                                      |
| `--instance-name`      | Optional: This is the name of the LMS instance to unbundle. If not passed, defaults to `lsone`.                                                                                  |
| `-d`/`--dry`             | Optional: This only outputs the commands that will be run and does not actually run them.                                                                                        |
| `-fe`/`--front-end-only` | Optional: This flag only unbundles the front-end components (useful if your LMS is on a different 'machine'). Cannot be used in combination with the `-be\--back-end-only` flag. |
| `-be`/`--back-end-only`  | Optional: This flag only unbundles the back-end components (useful if your BSI is on a different 'machine'). Cannot be used in combination with the `-fe\--front-end-only` flag. |

Examples:

Using a custom BSI path and a custom LMS instance name.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --bsi-path="C:\Users\d2l-employee\Developer\bsi" --instance-name="lstwo"
```

Dry-running the list of commands that will be run for a custom BSI path and a custom LMS instance path.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --bsi-path="C:\Users\d2l-employee\Developer\bsi" --instance-path="C:\Users\d2l-employee\instances" --dry
```

Only executing the front-end unbundling procedure.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --front-end-only
```

#### Running Unit Tests for the Unbundle Script

You can run the Unit Tests for the Unbundle Script using this command.

```shell
python unbundle-script/unbundle-tests.py
```