# Discord Bot
This is a discord bot made for my own personal use for a couple games that I play semi-frequently, Palworld and osu!

All commands are available in text and slash commands, as listed below.

# Palworld
For Palworld commands, start your message with "pw [command]", "pal [command]", or "palworld [command]".

The slash commands start with /pw

## **Commands**
### Pal Search - Name
Returns information on a pal based on a given pal name.

The syntax for this command is "pw [name]", where name is the name of the pal you want to search for. 

If there are multiple pals with the same name, then it will return the first pal found. For example,

"pw Mammorest" would return the information on Mammorest, but nothing about Mammorest Cryst, which is the variant pal.

### Pal Search - Number
Returns information on a pal based on a given number.

Variation of the name search, but with the pal number. For example,

"pw 1" would return information about Lamball, as that is the pal with number 1.

### Attribute Search
Returns a list of pals with the selected attribute, optionally with at least the given value. Value defaults to 1.

This syntax for this command is "pw attr [attribute] [value]", where [attribute] is the attribute you want to search for, and [value]
is the low end of the attribute you want to search for. 

i.e. "pw attr p 3"

Gives results for the attribute "planting" with a value of at least 3.


# osu!
Interact with the bot with "osu [command]". The slash commands start with /osu
## **Commands**
### User Search
Searches for a given user.

The syntax for this command is "osu user [user]" or "osu u [user]", where [user] is the user that you want to search for.
User can either be the display name of the player or their id. For example, "osu user Chocomint" would return the same
information as "osu user 124493"

Currently displays the user and their performance points, though will be adding more user information at a later date.

### Recent Play
Displays the most recent play[s] of a given user.

The syntax for this command is "osu recent [user] [value]" or "osu rs [user] [value]", where user is the user you want to search,
and [value] is the number of recent plays you want to display. Limits to 10 most recent plays, though will likely get decreased
in the future, and defaults to 1 play.

Currently displays the map title, difficulty, and accuracy of the play in the format 

"title: diff

accuracy"
