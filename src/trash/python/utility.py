prompt = '$: '

def printOptions(aList, aFunc):
    if (aList.__len__() == 0):
        print('list is empty')
        return None
    i = -1
    while i >= aList.__len__() or i < 0:
        try:
            myPrintFunction(aList, aFunc)
            i = getInput()
            if i == 'q' or i == 'e':
                return None
            else:
                i = int(i)
        except:
            print('that was not a number')
    
    return aList[i]

def myPrintFunction(aList, aFunc):
    for i in range(0, aList.__len__()):
        print('[%d] %s' % (i, aFunc(aList[i])))
    print('pick one of the options')

def getInput():
    toReturn = input(prompt)
    toReturn = tidyUpInput(toReturn)
    return toReturn

def tidyUpInput(c):
    return c.lower()