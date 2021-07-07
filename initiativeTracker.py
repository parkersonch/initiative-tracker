# TODO: refactor this to use objects instead of lists

inputFileName = 'input.txt'
outputFileName = 'initiative.txt'

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
        newCharacter = [name, initiative]
        if values.__len__() > 1:
            conditions = values[1].split(', ')
            for i in range(conditions.__len__()):
                conditions[i] = conditions[i].strip()
            newCharacter.append(conditions)
        else:
            newCharacter.append([])
        
        characters.append(newCharacter)
        line = inputFile.readline()

    if (characters.__len__() < 1):
        print('input file is empty')
        return

    characters.sort(key=lambda character: character[1], reverse=True)
    
    # for character in characters:
    #     print('%s: %d' % (character[0], character[1]))
    # print('')

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
            i += 1
            if i >= characters.__len__():
                i = 0
                round += 1
            
        # add condition(s) to character
        elif inputString[0] == 'c':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)
            for character in characters:
                if character[0].lower() == inputString[1]:
                    for j in range(2, inputString.__len__()):
                        character[2].append(inputString[j])
        
        # remove condition(s) from character
        elif inputString[0] == 'rc':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)
            for character in characters:
                if character[0].lower() == inputString[1]:
                    for condition in range(2, inputString.__len__()):
                        j = 0
                        while j < character[2].__len__():
                            if character[2][j].lower() == inputString[condition]:
                                character[2].pop(j)
                            j+=1

        # remove character from combat
        elif inputString[0] == 'r':
            #inputString[1] = character name
            toPop = -1
            for j in range(characters.__len__()):
                if characters[j][0].lower() == inputString[1]:
                    toPop = j
            if toPop != -1:
                characters.pop(toPop)
                if i == characters.__len__():
                    i = 0
            else:
                print('that\'s not a character')
        
        # add character to combat
        elif inputString[0] == 'a':
            #inputString[1] = character name
            #inputString[2] = initiative
            #inputString[3, 4, etc.] = conditions
            newCharacter = [inputString[1], int(inputString[2])]
            conditions = []
            for j in range(3, inputString.__len__()):
                conditions.append(inputString[j])
            newCharacter.append(conditions)
            characters.append(newCharacter)
            characters.sort(key=lambda character: character[1], reverse=True)

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


def getCharacterInitiativeString(character):
    toReturn = '\t%s: %d' % (character[0], character[1])
    for condition in character[2]:
        toReturn += ', %s' % condition
    toReturn += '\n'
    return toReturn

def getInput():
    toReturn = input('$: ')
    toReturn = tidyUpInput(toReturn)
    return toReturn

def tidyUpInput(c):
    return c.lower()

if __name__ == '__main__':
    main()