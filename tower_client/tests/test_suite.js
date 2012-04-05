function TestSuite() 
{
    this.tests = new Array();
    this.setUp = function () {
        this.tests.push(new ModelTest());
        this.tests.push(new ControllerTest());
    }
    this.tearDown = function () {
        this.tests = new Array();
    }
    this.run = function () {
        var numTests = 0;
        var passNumTests = 0;
        for (var i = 0; i < this.tests.length; ++i) {
            var test = this.tests[i];
            for (var j = 0; j < test.tests.length; ++j) {
                ++numTests;
                test.setUp();
                if (test.tests[j].call(test)) {
                    ++passNumTests;
                }
                test.tearDown();
            }
        }
        alert('Total ' + passNumTests + ' of ' + numTests + ' tests passed');
    }
}

function startup()
{
  var tsts = new TestSuite();
  tsts.setUp();
  tsts.run();
  tsts.tearDown();
}

$(document).ready(startup);
