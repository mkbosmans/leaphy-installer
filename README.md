# The Leaphy installer

## Building Leaphy installer

The Leaphy installer is a wrapper around the mBlock installer.
It runs the mBlock installer and configures some defaults for Leaphy.

### Prerequisites

  * Install NSIS: http://nsis.sourceforge.net/Download
  * Unzip the `Block_win_V3.4.11-installed.zip` file into a subfolder called `mBlock_win_V3.4.11-installed`.

### Building the installer

  * Right-click on the `Leaphy.nsi` file and select *Compile NSIS script*
  * Wait a while for the `Leaphy-setup.exe` file to be generated.

### Description of files

  * `mBlock_win_V3.4.11-installed.zip`
       A ZIP archive containing the contents of the mBlock program files folder after running
       of the mBlock installer.
       The mBlock installer is downloaded from http://www.mblock.cc/software/mblock/mblock3/
  * `Leaphyshield2`
       The Leaphy extention that needs to be installed into mBlock.
  * `mBlock.exe` and `welcome.swf`
       These are files from the mBlock installation, modified to have the Leaphy logo.
       For more on how to modify these files, see the hints at *Making changes to the installer*.
  * `makeblock.sol`
       User preference file: contains the lang=nl_NL setting and other stuff.


## Making changes to the installer

### mBlock user settings

Most of mBlock settings are stored in a Flash SharedObject file in the users roaming appdata folder.
(`%APPDATA%\com.makeblock.Scratch3.4.11\Local Store`)
This folder is usually created when mBlock is first launched.
The Leaphy installer customizes mBlock settings by copying some files to this Local Store.

In order to edit these preferences, a program to edit .sol files is needed.
There seem to be no good programs to do this, but an online editor is available: https://mariani.life/projects/minerva/

### mBlock installed files

To edit the mBlock .swf files, a flash decompiler is needed:
https://github.com/jindrapetrik/jpexs-decompiler/

To change the icon of a .exe, Resource Hacker is used.
