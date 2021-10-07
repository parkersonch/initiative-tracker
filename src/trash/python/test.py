from os import name
import unittest
from unittest import mock
import initiativeTracker
import utility
from character import Character

class TestInitiativeTracker1(unittest.TestCase):
    testFile = 'test/1.txt'
    expectedFile = 'test/expected.txt'

    @classmethod
    def setUpClass(self) -> None:
        return super().setUpClass()
    
    @classmethod
    def tearDownClass(cls) -> None:
        return super().tearDownClass()

    def setUp(self):
        self.expectedCharacters = [
            Character(
                name='mouse',
                initiative=3,
                conditions=[]
            ),
            Character(
                name='cat',
                initiative=2,
                conditions=[]
            ),
            Character(
                name='dog',
                initiative=1,
                conditions=[]
            )
        ]

        print('hello hello,', self.testFile)
        testf = open(self.testFile, 'r')
        inputf = open(initiativeTracker.inputFileName, 'w')

        testi = testf.read()
        inputf.write(testi)

        testf.close()
        inputf.close()
        return super().tearDown()

    def tearDown(self) -> None:
        return super().tearDown()

    def test_1_initial_order(self):
        performTest(
            myTest=self,
            inputs=['e'],
            expectedCharacters= self.expectedCharacters,
            endOfRoundIndex = 2,
            round=1
            )

    def test_1_n(self):
        self.expectedCharacters.append(self.expectedCharacters.pop(0))
        performTest(
            myTest=self,
            inputs=['n', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 1, 
            round=1
            )

    def test_1_nn(self):
        for i in range(0, 2):
            self.expectedCharacters.append(self.expectedCharacters.pop(0))
        performTest(
            myTest=self,
            inputs=['n','n','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=0,
            round=1
        )

    def test_1_nnn(self):
        for i in range(0, 3):
            self.expectedCharacters.append(self.expectedCharacters.pop(0))
        performTest(
            myTest=self,
            inputs=['n','n','n','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=2
        )

    def test_1_add_conditions(self):
        self.expectedCharacters[0].addConditions(['a condition'])
        performTest(
            myTest=self,
            inputs=['c; mouse; a condition', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )

        self.expectedCharacters[0].addConditions(['another condition'])
        performTest(
            myTest=self,
            inputs=['c; mouse; a condition; another condition', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c; mouse; a condition', 'c; mouse; another condition', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c','0','a condition, another condition', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c','0','a condition', 'c','0','another condition', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        self.expectedCharacters[0].addConditions(['a', 'b', 'c'])
        performTest(
            myTest=self,
            inputs=['c','0','a condition, another condition', 'c','0','a, b, c', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c','0','a condition, another condition', 'c; mouse; a; b; c', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c; mouse; a condition; another condition', 'c','0','a, b, c','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c; mouse; a condition; another condition', 'c; mouse; a; b; c', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c; mouse', 'a condition, another condition, a, b, c', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )

    def test_1_remove_conditions(self):
        self.expectedCharacters[0].addConditions(['a'])
        performTest(
            myTest=self,
            inputs=['c','0','a, b, c','rc; mouse; b; c', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )
        performTest(
            myTest=self,
            inputs=['c','0','a, b, c','rc','0','2','rc','0','1','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=2,
            round=1
        )

    def test_1_remove_character(self):
        self.expectedCharacters.pop(2)
        performTest(
            myTest=self,
            inputs=['r; dog','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 1,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['r','2','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 1,
            round = 1
        )

        self.expectedCharacters.pop(0)
        performTest(
            myTest=self,
            inputs=['r; mouse','r; dog','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 0,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['r','0','r','1','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 0,
            round = 1
        )

    def test_1_addCharacter(self):
        self.expectedCharacters.append(Character(
                name='slug',
                initiative=5,
                conditions=[]
            ))
        performTest(
            myTest=self,
            inputs=['a; slug; 5','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        self.expectedCharacters.insert(1, Character('bird', 3, []))
        performTest(
            myTest=self,
            inputs=['a; slug; 5', 'a; bird; 3', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 3,
            round = 1
        )

    def test_1_setHp(self):
        self.expectedCharacters[0].setHp(10)
        performTest(
            myTest=self,
            inputs=['hp; mouse; 10','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp','0','10','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp; mouse','10','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

    def test_1_setMaxHp(self):
        self.expectedCharacters[0].setMaxHp(10)
        performTest(
            myTest=self,
            inputs=['mhp; mouse; 10', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['mhp; mouse', '10', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['mhp','0','10','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

    def test_1_heal(self):
        self.expectedCharacters[0].setHp(15)
        performTest(
            myTest=self,
            inputs=['hp; mouse; 10', 'h; mouse; 5', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp; mouse; 10', 'h; mouse', '5', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp; mouse; 10', 'h','0','5','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

        self.expectedCharacters[0].setMaxHp(20)
        performTest(
            myTest=self,
            inputs=['mhp; mouse; 20', 'hp; mouse; 10', 'h; mouse; 5', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

        self.expectedCharacters[0].setHp(20)
        performTest(
            myTest=self,
            inputs=['mhp; mouse; 20', 'hp; mouse; 10', 'h; mouse; 15', 'h; mouse; 10', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

    def test_1_damage(self):
        self.expectedCharacters[0].setHp(15)
        performTest(
            myTest=self,
            inputs=['hp; mouse; 20', 'd; mouse; 5', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp; mouse; 20', 'd; mouse', '5', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        performTest(
            myTest=self,
            inputs=['hp; mouse; 20', 'd','0','5','e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )
        
        self.expectedCharacters[0].setHp(-5)
        self.expectedCharacters[0].addConditions(['incapacitated'])
        performTest(
            myTest=self,
            inputs=['hp; mouse; 20', 'd; mouse; 25', 'e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex = 2,
            round = 1
        )

    

    @mock.patch('utility.input', create=True)
    def test_printOptions(self, mocked_input):
        mocked_input.side_effect = ['0','1','2','3','0']

        testList = ['a', 'b', 'c']

        myFunc = lambda x: x

        self.assertEqual(utility.printOptions(testList, myFunc), 'a')
        self.assertEqual(utility.printOptions(testList, myFunc), 'b')
        self.assertEqual(utility.printOptions(testList, myFunc), 'c')
        self.assertEqual(utility.printOptions(testList, myFunc), 'a')

        testList = []

        self.assertIsNone(utility.printOptions(testList, myFunc))
    

class TestInitiativeTracker2(unittest.TestCase):
    testFile2 = 'test/2.txt'
    expectedFile = 'test/expected.txt'

    def setUp(self) -> None:
        self.expectedCharacters = [
            Character(
                name='halfling',
                initiative=7,
                conditions=[]
            ),
            Character(
                name='human',
                initiative=6,
                conditions=[],
                hp=10
            ),
            Character(
                name='elf',
                initiative=5,
                conditions=[],
                hp=10,
                maxHp=15
            ),
            Character(
                name='dwarf',
                initiative=4,
                conditions=[],
                hp=10,
                maxHp=5
            ),
            Character(
                name='orc',
                initiative=3,
                conditions=['one','two','three']
            ),
            Character(
                name='satyr',
                initiative=2,
                conditions=['super cool','groovy','sexually active'],
                hp=5
            ),
            Character(
                name='asymar',
                initiative=1,
                conditions=['loopy'],
                hp=12,
                maxHp=16
            )
        ]
        testf = open(self.testFile2, 'r')
        inputf = open(initiativeTracker.inputFileName, 'w')

        testi = testf.read()
        inputf.write(testi)

        testf.close()
        inputf.close()
        return super().setUp()    

    def tearDown(self) -> None:
        return super().tearDown()

    def test_2_init(self):
        performTest(
            myTest=self,
            inputs=['e'],
            expectedCharacters=self.expectedCharacters,
            endOfRoundIndex=6,
            round=1
        )


class TestCharacter(unittest.TestCase):
    def setUp(self) -> None:
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=[]
        )
        return super().setUp()

    def test_init_character(self):
        self.assertCharacterValues(self.myCharacter)

        self.myCharacter = Character(
            'my other name',
            '1',
            conditions=[]
        )

        self.assertCharacterValues(self.myCharacter, name='my other name')
    
    def test_init_character_hp(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=[],
            hp=12
        )

        self.assertCharacterValues(
            self.myCharacter,
            hp=12
        )

    def test_init_character_maxHp(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=[],
            maxHp=256
        )

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=256
            )

    def test_init_character_hp_and_maxHp(self):
        self.myCharacter = Character(
            name='slug',
            initiative = 112,
            hp=5,
            maxHp=20,
            conditions=[]
        )

        self.assertCharacterValues(
            self.myCharacter,
            initiative=112, 
            hp=5, 
            maxHp=20
            )

        self.myCharacter = Character(
            name='slug',
            initiative=15,
            hp=35,
            maxHp=20,
            conditions=[]
        )

        self.assertCharacterValues(
            self.myCharacter,
            initiative=15,
            hp=20,
            maxHp=20,
            conditions=[]
            )

    def test_init_character_conditions(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=['dog','cat','mouse']
        )

        self.assertCharacterValues(
            self.myCharacter,
            conditions=['dog','cat','mouse']
        )

    def test_init_character_tempHp(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=[],
            tempHp=10
        )

        self.assertCharacterValues(
            self.myCharacter,
            tempHp=10
        )

    def test_setHp(self):
        self.myCharacter.setHp(10)
        self.myCharacter.setHp(25)

        self.assertCharacterValues(
            self.myCharacter,
            hp=25
        )

        self.myCharacter.setMaxHp(25)
        self.myCharacter.setHp(50)

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=25,
            hp=25
        )

    def test_setMaxHp(self):
        self.myCharacter.setMaxHp(45)
        self.myCharacter.setMaxHp(55)

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=55
        )

        self.myCharacter.setHp(30)

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=55,
            hp=30
        )

        self.myCharacter.setMaxHp(50)

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=50,
            hp=25
        )

        self.myCharacter.setMaxHp(100)

        self.assertCharacterValues(
            self.myCharacter,
            maxHp=100,
            hp=75
        )

    def test_setTempHp(self):
        self.myCharacter.setTempHp(10)
        self.assertCharacterValues(
            self.myCharacter,
            tempHp=10
        )

    def test_heal(self):
        self.myCharacter.setHp(10)
        self.myCharacter.heal(10)

        self.assertCharacterValues(
            self.myCharacter,
            hp=20
        )

        self.myCharacter.setMaxHp(25)
        self.myCharacter.heal(10)

        self.assertCharacterValues(
            self.myCharacter,
            hp=25,
            maxHp=25
        )

        self.myCharacter.setHp(10)
        self.myCharacter.setTempHp(10)
        self.myCharacter.heal(10)

        self.assertCharacterValues(
            self.myCharacter,
            hp=20,
            maxHp=25,
            tempHp=10
        )

    def test_getInitiativeString(self):
        characterString = {
            'nameAndInitiative': 'slug: 1'
        }
        self.assertEqual(self.myCharacter.getInitiativeString(), generateExpectedCharacterString(characterString, False))

        self.myCharacter.setHp(5)
        characterString['hp'] = '5 hp'
        self.assertEqual(self.myCharacter.getInitiativeString(), generateExpectedCharacterString(characterString, False))

        self.myCharacter.setMaxHp(10)
        characterString['hp'] = '5/10 hp'
        self.assertEqual(self.myCharacter.getInitiativeString(), generateExpectedCharacterString(characterString, False))

        self.myCharacter.addConditions(['dog', 'cat', 'fruit'])
        characterString['conditions'] = 'Conditions: dog, cat, fruit'
        self.assertEqual(self.myCharacter.getInitiativeString(), generateExpectedCharacterString(characterString, False))

        self.myCharacter.setTempHp(10)
        characterString['hp'] = '10 temp hp -- 5/10 hp'
        self.assertEqual(self.myCharacter.getInitiativeString(), generateExpectedCharacterString(characterString, False))

    def test_damage(self):
        self.myCharacter = Character(
            'slug',
            initiative=1,
            conditions=[],
            hp=10,
            maxHp=20
        )

        self.myCharacter.damage(5)
        self.assertCharacterValues(
            self.myCharacter,
            hp = 5,
            maxHp=20
        )

        self.myCharacter.damage(12)
        self.assertCharacterValues(
            self.myCharacter,
            hp = -7,
            maxHp=20,
            conditions=['incapacitated']
        )

        self.myCharacter.setHp(100)
        self.myCharacter.removeConditions(['incapacitated'])
        self.myCharacter.damage(5)
        self.assertCharacterValues(
            self.myCharacter,
            hp = 15,
            maxHp=20
        )

        self.myCharacter.setTempHp(10)
        self.myCharacter.damage(5)
        self.assertCharacterValues(
            self.myCharacter,
            hp = 15,
            maxHp=20,
            tempHp=5
        )

        self.myCharacter.damage(5)
        self.assertCharacterValues(
            self.myCharacter,
            hp = 15,
            maxHp=20
        )

        self.myCharacter.setTempHp(15)
        self.myCharacter.damage(20)
        self.assertCharacterValues(
            self.myCharacter,
            hp = 10,
            maxHp=20
        )

    def test_addConditions(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=[]
        )

        self.myCharacter.addConditions(['alive'])
        self.assertCharacterValues(
            self.myCharacter,
            conditions=['alive']
        )

        self.myCharacter.addConditions(['dead', 'hungry'])
        self.assertCharacterValues(
            self.myCharacter,
            conditions=['alive', 'dead', 'hungry']
        )

    def test_removeConditions(self):
        self.myCharacter = Character(
            name='slug',
            initiative=1,
            conditions=['ready to play']
        )

        self.myCharacter.removeConditions(['blah'])
        self.assertCharacterValues(
            self.myCharacter,
            conditions=['ready to play']
        )

        self.myCharacter.removeConditions(['ready to play'])
        self.assertCharacterValues(
            self.myCharacter
        )

        self.myCharacter.removeConditions(['blah'])
        self.assertCharacterValues(
            self.myCharacter
        )

        self.myCharacter.addConditions(['one', 'two', 'six', 'nine'])
        self.myCharacter.removeConditions(['two'])
        self.assertCharacterValues(
            self.myCharacter,
            conditions=['one', 'six', 'nine']
        )

        self.myCharacter.removeConditions(['six', 'nine'])
        self.assertCharacterValues(
            self.myCharacter,
            conditions=['one']
        )

    def assertCharacterValues(self, myCharacter, name='slug', initiative=1, hp=None, maxHp=None, tempHp=None, conditions=[]):
        self.assertEqual(myCharacter.name, name)
        self.assertEqual(myCharacter.initiative, initiative)

        if maxHp is None:
            self.assertIsNone(myCharacter.maxHp)
        else:
            self.assertEqual(myCharacter.maxHp, maxHp)
        
        if hp is None:
            self.assertIsNone(myCharacter.hp)
        else:
            self.assertEqual(myCharacter.hp, hp)

        if tempHp is None:
            self.assertIsNone(myCharacter.tempHp)
        else:
            self.assertEqual(myCharacter.tempHp, tempHp)

        self.assertListEqual(myCharacter.conditions, conditions)

def generateExpectedCharacterString(characterString, endOfRound):
    toReturn = '\t%s\n' % characterString['nameAndInitiative']
    if 'hp' in characterString:
        toReturn += '\t\t%s\n' % characterString['hp']
    if 'conditions' in characterString:
        toReturn += '\t\t%s\n' % characterString['conditions']
    if endOfRound:
        toReturn += '--END OF ROUND--\n'

    return toReturn     

def generateExpectedInitiativeFile(expectedCharacters, endOfRoundIndex, round):
        toReturn = 'Current Turn:\n'
        toReturn += expectedCharacters[0].getInitiativeString()
        if endOfRoundIndex == 0:
            toReturn += '--END OF ROUND--\n'
        toReturn += '\nNext in order:\n'
        for i in range(1, expectedCharacters.__len__()):
            toReturn += expectedCharacters[i].getInitiativeString()
            if endOfRoundIndex == i:
                toReturn += '--END OF ROUND--\n'
        toReturn += '\nRound: %d\n\n\nbrought to you by DM Bowtie TM' % round

        return toReturn

@mock.patch('utility.input', create=True)
def performTest(mocked_input, myTest, inputs, expectedCharacters, endOfRoundIndex, round):
    mocked_input.side_effect = inputs

    initiativeTracker.main()

    myTest.expected_write = open(myTest.expectedFile, 'w')
    myTest.expected_write.write(generateExpectedInitiativeFile(expectedCharacters, endOfRoundIndex, round))
    myTest.expected_write.close()

    expectedf = open(myTest.expectedFile, 'r')
    resultf = open(initiativeTracker.outputFileName, 'r')

    try:
        expectedLine = expectedf.readline()
        resultLine = resultf.readline()
        i = 0

        while expectedLine != '':
            myTest.assertEqual(expectedLine, resultLine, 'line %d:\n%s\nwas the result. it does not equal\n%s\nwhich was expected.\n' % (i, resultLine, expectedLine))
            expectedLine = expectedf.readline()
            resultLine = resultf.readline()
            i+=1

        myTest.assertEqual('', resultLine, 'result had more lines that was expected\n')
    finally:
        expectedf.close()
        resultf.close()

if __name__ == '__main__':
    unittest.main()