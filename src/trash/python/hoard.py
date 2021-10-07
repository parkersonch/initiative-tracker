from character import Character


class Hoard(object):
    def __init__(self, name, initiative, conditions, hp=None, maxHp=None, tempHp=None, numCharacters=1):
        self.name = name
        
        try:
            self.initiative = int(initiative)
            self.characters = []
            for i in range(0, numCharacters):
                newName = name + ' ' + str(i)
                self.characters.append(Character(newName, initiative, conditions, hp, maxHp, tempHp))

        except:
            print('mistake while creating hoard')

    def setHp(self, newHp, num):
        if num > self.characters.__len__():
            print('num was too big')
            return
        for i in range(0, num):
            self.characters[i].setHp(newHp)

    def setMaxHp(self, newMaxHp, num):
        if num > self.characters.__len__():
            print('num was too big')
            return
        for i in range(0, num):
            self.characters[i].setMaxHp(newMaxHp)

    def setTempHp(self, newTempHp, num):
        if num > self.characters.__len__():
            print('num was too big')
            return
        for i in range(0, num):
            self.characters[i].setTempHp(newTempHp)



    def heal(self, healAmount, num):
        if num > self.characters.__len__():
            print('num was too big')
            return
        for i in range(0, num):
            self.characters[i].heal(healAmount)
    
    def getInitiativeString(self):
        toReturn = '\t%s: %d' % (self.name, self.initiative)
        toReturn+='\n\t\t%d characters' % self.characters.__len__()
        for i in range(0,self.characters.__len__()):
            toReturn+='\n\t\t\t'
            toReturn+='%s: ' % self.characters[i].name

            character = self.characters[i]
            if character.hp is not None:
                if character.tempHp is not None:
                    toReturn += '%d temp hp -- ' % character.tempHp
                toReturn += '%d' % character.hp
                if character.maxHp is not None:
                    toReturn += '/%d' % character.maxHp
                toReturn += ' hp'
            if character.conditions.__len__() > 0:
                if character.hp is not None:
                    toReturn+='; '
                toReturn+= 'Conditions: %s' % character.conditions[0]
                for condition in character.conditions[1 : character.conditions.__len__()]:
                    toReturn += ', %s' % condition
        toReturn += '\n'


        return toReturn

    def damage(self, damageAmount, num):
        if num > self.characters.__len__():
            print('num was too big')
            return
        for i in range(0, num):
            self.characters[i].damage(damageAmount)

    def addConditions(self, conditions, num):
        if num > self.characters.__len__():
            print('num too big')
            return
        for i in range(0, num):
            self.characters[i].addConditions(conditions)
    
    def removeConditions(self, conditions, num):
        if num > self.characters.__len__():
            print('num too big')
            return
        for i in range(0, num):
            self.characters[i].removeConditions(conditions)