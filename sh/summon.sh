# SCRIPT FOR SETTING UP WORKSPACES
# ================================
# edit config var to set whihch apps go in which space, you can add multiple apps to a space

# before running make sure you:
# -------------------------------
# 1) give access to key controls in security to running script system prefs > security > accessibility
# 2) set up default keyboard shortcuts for desktops in system prefs > keyboard > mission control > desktop 1..9 (should be ^1, ^2)
# 3) make sure apps you are not assigned to any desktop (right click > options > assign should be 'none')

# Example config
# ---------------
# ```
# #1
# /Applications/Google Chrome.app/

# #2
# /Applications/Slack.app/

# #3
# /System/Applications/Messages.app/
# ```

# Usage (CLI)
# -------
# # summon.sh ./myConfig.spell.txt Terminal
# $ summon.sh <config file> <exec app name>


killAllDockApps() {
  osascript -e "tell application \"System Events\"
    set appList to the name of every process whose background only is false and name does not contain \"$1\" and name does not contain \"screencapture\" and name does not contain \"QuickTime\" and id is not $$
  end tell
  repeat with theApp in appList
    try
      tell application theApp to quit
    end try
  end repeat
  "
}

switchDesktop() {
  declare -a desktophash=(29 18 19 20 21 23 22 26 28 25)
  desktopkey=${desktophash[$1]}
  osascript -e "tell application \"System Events\" to key code $desktopkey using control down"
}

config=`cat "$1"`

echo "killing all apps.."
killAllDockApps $2
sleep 5
while IFS= read -r line; do
    desktop_pattern="^#(\d+)$"
    desktop_num=`echo "${line}" | sed -n 's/^#\([^#]*\).*/\1/p'`
    if [ -z "$line" ]
    then
      echo "empty line"
    elif [ -z "$desktop_num" ]
    then
      echo "need to open $line"
      open -n "$line"
    else
      echo "switch to desktop $desktop_num"
      sleep 2
      switchDesktop $desktop_num
      sleep 5
    fi
done <<< "$config"
