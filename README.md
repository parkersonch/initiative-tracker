# initiative tracker
create a file called input.txt and put it in the same folder as initiativeTracker.py. Fill out input.txt with everything that is participating in combat in the following form:
name: initiative count; condition1, condition2, etc.
name: initiative count; condition1, condition2, etc.

When you run the script, it will generate a file called initiative.txt
initiative.txt will show you whos turn it is right now, as well as the rest of the initiative order and the round number.
The script sorts the entries by initiative count, so you do not need to sort them yourself when entering values.

To advance combat, use the following commands. Every command will also update initiative.txt.
n
    finish the current turn and move onto the next one.
c; character name; condition1; condition2; etc.
    this will add one or more conditions to a character.
rc; character name; condition1; condition2; etc.
    this will remove one or more conditions from a character.
r; character name
    this will remove a character from combat.
a; character name; initiative count; condition1; condition2; etc.
    this will add a character to combat.