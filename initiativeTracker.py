# TODO: refactor this to use objects instead of lists
# TODO: add going back a turn
# TODO: add hp tracking? maybe?;

inputFileName = 'input.txt'
outputFileName = 'initiative.txt'
prompt = '$: '

def main():
    inputFile = open(inputFileName, 'r')
    characters = []

    line = inputFile.readline()
    while line != '':
        stringArray = line.split(': ')
        #stringArray[0] = name
        #stringArray[1] = initiative count; condition1, condition2, etc.
        if stringArray.__len__() != 2:
            print('error: did not understand input')
            return
        
        name = stringArray[0]        
        values = stringArray[1].split('; ')
        #values[0] = initiative count
        #values[1] = condition1, condition2, etc.
        initiative = int(values[0])
        newCharacter = {
            'name': name,
            'initiative': initiative,
            'conditions': []
        }
        if values.__len__() > 1:
            for i in values[1].split(', '):
                newCharacter['conditions'].append(i.strip())
        else:
            newCharacter['conditions']=[]
        
        characters.append(newCharacter)
        line = inputFile.readline()

    sortCharacters(characters)

    # loop setup
    i = 0
    round = 1
    c = ''
    writeInitiative(characters, i, round)

    while c != 'end combat':
        # print('expected: %s\nactual: %s' % ('end combat', c))
        inputString = c.split(';')
        for j in range(inputString.__len__()):
            inputString[j] = inputString[j].strip()
        # inputString[0] = command
        # inputString[1, 2, etc.] = arguments

        # next turn
        if inputString[0] == 'n' or (i==0 and round==1):
            i=getNextIndex()
            
        # add condition(s) to character
        elif inputString[0] == 'c':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)
            for character in characters:
                if character['name'].lower() == inputString[1]:
                    for j in range(2, inputString.__len__()):
                        character['conditions'].append(inputString[j])
        
        # remove condition(s) from character
        elif inputString[0] == 'rc':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)
            for character in characters:
                if character['name'].lower() == inputString[1]:
                    for condition in range(2, inputString.__len__()):
                        j = 0
                        while j < character['conditions'].__len__():
                            if character['conditions'][j].lower() == inputString[condition]:
                                character['conditions'].pop(j)
                            j+=1

        # remove character from combat
        elif inputString[0] == 'r':
            #inputString[1] = character name
            toPop = -1
            for j in range(characters.__len__()):
                if characters[j]['name'].lower() == inputString[1]:
                    toPop = j
            if toPop != -1:
                currentCharacter = characters[i]['name']
                if i==toPop:
                    currentCharacter = characters[getNextIndex()]['name']
                characters.pop(toPop)
                i = getIndexOfCharacter(currentCharacter)
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
                newCharacter = {
                    'name': inputString[1],
                    'initiative': int(inputString[2]),
                    'conditions': []
                }
            except:
                print('error creating new character; maybe initiative was not a number?')
            conditions = []
            for j in range(3, inputString.__len__()):
                conditions.append(inputString[j])
            newCharacter['conditions'] = conditions
            characters.append(newCharacter)
            currentCharacter = characters[i]['name']
            sortCharacters(characters)
            i = getIndexOfCharacter(currentCharacter, characters)

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
    f = open(outputFileName, 'w')
    f.write('Current Turn:\n')
    f.write(getCharacterInitiativeString(characters[i]))
    f.write('\nNext in order:\n')

    index = i+1
    if index >= characters.__len__():
            index = 0

    while(index != i):
        # we don't want to increment on the first loop        
        f.write(getCharacterInitiativeString(characters[index]))

        index+=1
        if index >= characters.__len__():
            index = 0        

    f.write('\nRound: %d' % round)
    f.close()

def sortCharacters(characters):
    characters.sort(key=lambda character: character['initiative'], reverse=True)

def getCharacterInitiativeString(character):
    toReturn = '\t%s: %d' % (character['name'], character['initiative'])
    for condition in character['conditions']:
        toReturn += ', %s' % condition
    toReturn += '\n'
    return toReturn

def getInput():
    toReturn = input(prompt)
    toReturn = tidyUpInput(toReturn)
    return toReturn

def getNextIndex(i, characters):
    return (i+1) % characters.__len__()

def getIndexOfCharacter(name, characters):
    for i in range(characters.__len__()):
        if characters[i]['name'] == name:
            return i
    return -1

def tidyUpInput(c):
    return c.lower()

if __name__ == '__main__':
    main()