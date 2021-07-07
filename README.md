# initiative tracker
create a file called input.txt and put it in the same folder as initiativeTracker.py. Fill out input.txt with everything that is participating in combat in the following form:
name: initiativeCount; condition1, condition2, etc.
name: initiativeCount; condition1, condition2, etc.

When you run the script, it will generate a file called initiative.txt
initiative.txt will show you whos turn it is right now, as well as the rest of the initiative order and the round number.
The script sorts the entries by initiative count, so you do not need to sort them yourself when entering values.

To advance combat, use the following commands:
n
    finish the current turn and move onto the next one. This will update initiative.txt.
c; character name; condition1, condition2, etc.
    this will add one or more conditions to a character. initiative.txt will update accordingly.
d; character name
    this will do something eventually i'm still working on it