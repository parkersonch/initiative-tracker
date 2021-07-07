inputFileName = 'input.txt'

def main():
    inputFile = open(inputFileName, 'r')
    characters = []

    line = inputFile.readline()
    while line != '':
        stringArray = line.split(': ')
        if stringArray.__len__() != 2:
            print('error: did not understand input')
            return
        
        name = stringArray[0]        
        values = stringArray[1].split('; ')
        initiative = int(values[0])
        newCharacter = [name, initiative]
        if values.__len__() > 1:
            conditions = values[1].split(', ')
            newCharacter.append(conditions)
        
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

    while c != 'end combat':
        # print('expected: %s\nactual: %s' % ('end combat', c))
        inputString = c.split(';')
        # inputString[0] = command
        # inputString[1, 2, etc.] = arguments
        if inputString[0] == 'n' or (i==0 and round==1):
            writeInitiative(characters, i, round)
            i += 1
            if i == characters.__len__():
                i = 0
                round += 1
        elif inputString[0] == 'c':
            #inputString[1] = character name
            #inputString[2, 3, etc.] = condition(s)
            for character in characters:
                if character[0] == inputString[1]:
                    character[2].append(inputString[2])
            writeInitiative(characters, i, round)
        elif inputString[0] == 'd':
            #inputString[1] = character name
            for character in characters:
                if character[0] == inputString[1]:
                    1+1



        c = getInput() 
        
def writeInitiative(characters, i, round):
    if (i >= characters.__len__()):
        print('write initiative: i is too big')
        return
    if i < 0:
        print('write initiative: i is too small')
    f = open('initiative.txt', 'w')
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
    if (character.__len__() > 2):
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