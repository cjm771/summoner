# Summoner for Mac

![screen](https://i.imgur.com/wr9H5RO.png)
## About

Have X amount of dedicated desktops that you manually set up before working? Its a pain. Summoner kills all your GUI apps, and respawns on your assigned desktops, all automagically.

A Quick-and-dirty Spaces (Multiple Desktop) State Saver / Restorer for whatever your needs might be. Written as an Electron Tray App wrapping a shell script.
Configurations are stored as text files, so you can save / load as you need. Workspace set up for work, fun, etc.

**BETA NOTICE: This is a super rough rendition. Currently there is no prod build even. Stay tuned.**

## Example
Creating a new 'spell' which populates Desktop 1, 2, 3 with Mail, Calendar, and Notes.

![preview](https://i.imgur.com/S25vWCq.gif)


## Before Running

For it to work make sure you do the following beforw attempting.

1) give access to key controls in security to running script system prefs > security > accessibility
2) set up default keyboard shortcuts for desktops in system prefs > keyboard > mission control > desktop 1..9 (should be ^1, ^2)
3) make sure apps you are not assigned to any desktop (right click > options > assign should be 'none')

## To create

Click `New Spell..` > Give it a name > Type / Paste your configuration (See below for format)
## Example Configuration

The following is an example of what the file looks like. Empty lines are ignored. `#<num>` Represents the desktop number and all apps below it will be run as the command `open <app>`. You can add as many apps as you want
``` sh
#1
/Applications/Google Chrome.app

#2
/Applications/Slack.app

#3
/System/Applications/Messages.app/
```