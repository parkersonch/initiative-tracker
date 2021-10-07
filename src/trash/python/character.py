class Character(object):
    def __init__(self, name, initiative, conditions, hp=None, maxHp=None, tempHp=None):
        try:
            self.name = name
            self.initiative = int(initiative)

            if maxHp is not None:
                self.maxHp = int(maxHp)
            else:
                self.maxHp = None
            
            if hp is not None:
                self.hp = int(hp)
                self.setHp(self.hp)
            else:
                self.hp = None    

            if tempHp is not None:
                self.tempHp = int(tempHp)
            else:
                self.tempHp = None   
            
            self.conditions = conditions
        except:
            print('oopsy woopsy! looks like you tried to initialize a character with bad inputs UwU')
            self.initiative = 1
            self.maxHp = None
            self.hp = None
            self.conditions = []

    def setHp(self, newHp):
        if self.maxHp is None or newHp is None:
            self.hp = newHp
            return

        if newHp > self.maxHp:
            self.hp = self.maxHp
        else:
            self.hp = newHp

    def setMaxHp(self, newHpMax):
        if self.maxHp is None:
            self.maxHp = newHpMax
            self.setHp(self.hp)
        else:
            hpMaxDiff = newHpMax - self.maxHp
            self.maxHp = newHpMax
            # when hpMax changes, hp goes up or down with it
            self.heal(hpMaxDiff)
    
    def setTempHp(self, newTempHp):
        self.tempHp = newTempHp
        if self.tempHp <= 0:
            self.tempHp = None

    def heal(self, healAmount):
        if self.hp is not None:
            self.setHp(self.hp+healAmount)

    def getInitiativeString(self):
        toReturn = '\t%s: %d' % (self.name, self.initiative)
        if self.hp is not None:
            toReturn+='\n\t\t'
            if self.tempHp is not None:
                toReturn += '%d temp hp -- ' % self.tempHp
            toReturn += '%d' % self.hp
            if self.maxHp is not None:
                toReturn += '/%d' % self.maxHp
            toReturn += ' hp'
        if self.conditions.__len__() != 0:
            toReturn+= '\n\t\tConditions: %s' % self.conditions[0]
            for condition in self.conditions[1 : self.conditions.__len__()]:
                toReturn += ', %s' % condition
        toReturn += '\n'
        
        return toReturn

    def damage(self, damageAmount):
        if self.tempHp is not None:
            leftOverDamage = damageAmount - self.tempHp
            self.setTempHp(self.tempHp - damageAmount)
            if leftOverDamage > 0:
                self.setHp(self.hp-leftOverDamage)
        else:
            self.setHp(self.hp-damageAmount)
        
        if self.hp <= 0:
            self.addConditions(['incapacitated'])

    def addConditions(self, newConditions):
        for condition in newConditions:
            self.conditions.append(condition)
        self.apple = 'poop'

    def removeConditions(self, conditions):
        for condition in conditions:
            i = 0
            while i < self.conditions.__len__():
                if self.conditions[i].lower() == condition:
                    self.conditions.pop(i)
                i+=1