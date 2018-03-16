
The Leaphy installer
====================

The Leaphy installer is a wrapper around the mBlock installer.
It runs the mBlock installer and configures some defaults for Leaphy.


Prerequisites
-------------

  * Install NSIS: http://nsis.sourceforge.net/Download


Building the installer
----------------------

  * Right-click on the `Leaphy.nsi` file and select *Compile NSIS script*
  * After a few seconds the `Leaphy-setup.exe` file is generated.


Description of files
--------------------

  * `mBlock_win_V3.4.11.exe`
       The mBlock installer downloaded from http://www.mblock.cc/software/mblock/mblock3/
  * `mBlock_win.inf`
       Some presets for the mBlock installer
  * `Leaphyshield2.zip`
       The Leaphy extention that needs to be installed into mBlock.
  * `makeblock.sol`
       User preference file: contains the lang=nl_NL setting and other stuff


Making changes to the installer
-------------------------------

Most of mBlock settings are stored in a Flash SharedObject file in the users roaming appdata folder.
(`%APPDATA%\com.makeblock.Scratch3.4.11\Local Store`)
This folder is usually created when mBlock is first launched.
The Leaphy installer customizes mBlock settings by copying some files to this Local Store.

In order to edit these preferences, a program to edit .sol files is needed.
There seem to be no good programs to do this, but an online editor is available: https://mariani.life/projects/minerva/

