from hoard import Hoard
from character import Character
from utility import printOptions, getInput

# TODO: refactor this to use objects instead of lists
# TODO: add going back a turn
# TODO: add hoards

inputFileName = 'input.txt'
outputFileName = 'initiative.txt'
prompt = '$: '

def main():
    inputFile = open(inputFileName, 'r')
    characters = []

    line = inputFile.readline()
    while line != '':
        if line[0] == '#':
            break
        stringArray = line.split(': ')
        #stringArray[0] = name
        #stringArray[1] = initiative count; hp/hp max; condition1, condition2, etc.; is hoard
        if stringArray.__len__() != 2:
            print('error: did not understand input')
            inputFile.close()
            return
        
        name = stringArray[0]        
        values = stringArray[1].split(';')
        #values[0] = initiative count
        #values[1] = hp/hp max (or -)
        #values[2] = condition1, condition2, etc
        #values[3] = hoard, numCharacters
        for value in range(0, values.__len__()):
            values[value] = values[value].strip()
        initiative = int(values[0])
        conditions = []
        hp = None
        maxHp = None
        hoard = False
        numCharacters = 1
        if values.__len__() > 1:
            # print(values[1])
            # handle hp
            if values[1] != '-' and values[1] != '':
                hpValues = values[1].split('/')
                # hpValues[0] = hp
                # hpValues[1] = hpMax
                if hpValues.__len__() > 2:
                    print('hp was inputed incorrectly for %s' % name)
                    inputFile.close()
                    return
                try:
                    hp = int(hpValues[0].strip())
                    if hpValues.__len__() == 2:
                        maxHp = int(hpValues[1].strip())
                except:
                    print('hp was inputed incorrectly for %s' % newCharacter.name)
                    inputFile.close()
                    return


            # conditions
            if values.__len__() >= 3:
                for i in values[2].split(', '):
                    if i != '':
                        conditions.append(i.strip())

                if values.__len__() >= 4:
                    hoardValue = values[3].split(', ')
                    if hoardValue[0].strip().lower() == 'hoard':
                        hoard = True
                        try:
                            numCharacters = int(hoardValue[1].strip())
                        except:
                            print('error for input on hoard')
                            inputFile.close()
                            return


        newCharacter = None
        if hoard:
            newCharacter = Hoard(name, initiative, conditions, hp, maxHp, None, numCharacters)
        else:
            newCharacter = Character(name, initiative, conditions, hp, maxHp, None)
        
        
        characters.append(newCharacter)
        line = inputFile.readline()

    inputFile.close()
    sortCharacters(characters)

    # loop setup
    i = 0
    round = 1
    writeInitiative(characters, i, round)
    c = getInput()

    while c != 'end combat' and c != 'e' and c != 'q':
        inputString = c.split(';')
        for j in range(inputString.__len__()):
            inputString[j] = inputString[j].strip()
        # inputString[0] = command
        # inputString[1, 2, etc.] = arguments

        # next turn
        if inputString[0] == 'n':
            i=getNextIndex(i, characters)
            if i == 0:
                round+=1
            
        # add condition(s) to character
        elif inputString[0] == 'c':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)

            # get character
            character = pickACharacter(inputString, characters)

            if character is not None:
                num = None
                if isinstance(character, Hoard):
                    options = ['all'] + list(range(1, character.characters.__len__()))
                    num = printOptions(options, lambda x: x)
                    try:
                        num = int(num)
                    except:
                        print('num was not a number')
                        num = None

                    if num == 'all':
                        num = character.characters.__len__()

                conditions = None
                if inputString.__len__() > 2:
                    conditions = inputString[2:inputString.__len__()]
                else:
                    print('enter conditions to add; separate conditions with a comma')
                    conditions = getInput().split(',')
                    for j in range(0, conditions.__len__()):
                        conditions[j] = conditions[j].strip()

                if conditions is not None:
                    if numCharacters is not None:
                        character.addConditions(conditions, num)
                    else:
                        character.addConditions(conditions)
        
        # remove condition(s) from character
        elif inputString[0] == 'rc':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)

            # get the character we will be modifying
            character = pickACharacter(inputString, characters)
            
            # character will still be none at this point if the user input a name that doesn't exist in the initiative order
            if character is not None:
                # get a list of conditions to remove
                oldConditions = None
                if inputString.__len__() > 2:
                    oldConditions = inputString[2:inputString.__len__()]
                else:
                    oldConditions = [printOptions(character.conditions, lambda x: x)]
                
                if oldConditions is not None:
                    # hopefully old conditions is never None, but might as well be safe i guess
                    # remove conditions from character
                    character.removeConditions(oldConditions)


        # remove character from combat
        elif inputString[0] == 'r':
            #inputString[1] = character name
            characterName = pickACharacter(inputString, characters).name

            toPop = getIndexOfCharacter(characterName, characters)
            if toPop != -1:
                currentCharacter = characters[i].name
                if i==toPop:
                    currentCharacter = characters[getNextIndex(i, characters)].name
                characters.pop(toPop)
                i = getIndexOfCharacter(currentCharacter, characters)
                if i == -1:
                    print('error: did not find character %s for some reason' % currentCharacter)
                    i = 0
            else:
                print('that\'s not a character')
        
        # add character to combat
        elif inputString[0] == 'a':
            #inputString[1] = character name
            #inputString[2] = initiative
            #inputString[3, 4, etc.] = conditions
            try:
                newCharacter = Character(inputString[1], int(inputString[2]), conditions=[])
                conditions = []
                for j in range(3, inputString.__len__()):
                    conditions.append(inputString[j])
                newCharacter.addConditions(conditions)
                characters.append(newCharacter)
                currentCharacter = characters[i].name
                sortCharacters(characters)
                i = getIndexOfCharacter(currentCharacter, characters)
            except:
                print('error creating new character; maybe initiative was not a number? or wrong number of arguments?')
            
        
        # heal character
        elif inputString[0] == 'h':
            #inputString[1] = character name
            #inputString[2] = heal amount
            character = pickACharacter(inputString, characters)
            
            if character is not None:
                modifyCharacterByValue(inputString, 
                character, 
                lambda char, healAmount: char.heal(healAmount), 
                'enter amount to heal %s' % character.name, 
                'heal amount was not a number'
                )
        
        # damage character
        elif inputString[0] == 'd':
            #inputString[1] = character name
            #inputString[2] = damage amount
            character = pickACharacter(inputString, characters)
            modifyCharacterByValue(
                inputString,
                character,
                lambda char, damageAmount: char.damage(damageAmount),
                'enter amount to damage %s' % character.name,
                'damage amount was not a number'
            )
        
        # change hp
        elif inputString[0] == 'hp':
            # inputString[1] = character name
            # inputString[2] = new hp
            character = pickACharacter(inputString, characters)
            modifyCharacterByValue(
                inputString,
                character,
                lambda char, newHp: char.setHp(newHp),
                'enter new hp for %s' % character.name,
                'hp was not a number'
            )

        # change hpMax
        elif inputString[0] == 'mhp':
            # inputString[1] = character name
            # inputString[2] = new max hp
            character = pickACharacter(inputString, characters)
            modifyCharacterByValue(
                inputString,
                character,
                lambda char, newMaxHp: char.setMaxHp(newMaxHp),
                'enter new max hp for %s' % character.name,
                'max hp was not a number'
            )


        writeInitiative(characters, i, round)
        c = getInput() 
        
def writeInitiative(characters, i, round):
    if characters.__len__() == 0:
        f = open(outputFileName, 'w')
        f.write('no characters in combat')
        f.close()
        return
    if (i >= characters.__len__()):
        print('write initiative: i is too big. i is %d' % i)
        return
    if i < 0:
        print('write initiative: i is too small')
        return
    f = open(outputFileName, 'w')
    f.write('Current Turn:\n')
    f.write(getCharacterInitiativeString(characters, i))
    f.write('\nNext in order:\n')

    index = i+1
    if index >= characters.__len__():
            index = 0

    while(index != i):
        # we don't want to increment on the first loop        
        f.write(getCharacterInitiativeString(characters, index))

        index+=1
        if index >= characters.__len__():
            index = 0        

    f.write('\nRound: %d\n\n\nbrought to you by DM Bowtie TM' % round)
    f.close()

def sortCharacters(characters):
    characters.sort(key=lambda character: character.initiative, reverse=True)

def getCharacterInitiativeString(characters, i):
    toReturn = characters[i].getInitiativeString()
    if i == characters.__len__()-1:
        toReturn += '--END OF ROUND--\n'
    return toReturn

def getNextIndex(i, characters):
    return (i+1) % characters.__len__()

def getIndexOfCharacter(name, characters):
    if name is None:
        return -1

    for i in range(characters.__len__()):
        if characters[i].name.lower() == name.lower():
            return i
    return -1





def pickACharacter(inputString, characters):
    character = None
    if inputString.__len__() == 1:
        character = printOptions(characters, lambda char: char.name)
    else:
        j = getIndexOfCharacter(inputString[1], characters)
        if j == -1:
            print('no character with name %s' % inputString[1])
        else:
            character = characters[j]

    return character

def modifyCharacterByValue(inputString, character, myFunc, promptString, errorString):
    amount = None
    if inputString.__len__() >= 3:
        amount = inputString[2]
    else:
        print(promptString)
        amount = getInput()
    
    try:
        myFunc(character, int(amount))
    except:
        print(errorString)


if __name__ == '__main__':
    main()