testrunner.define({
  testPass : function()
  {
    this.assert(true);
  },
  
  testFail : function()
  {
    this.assert(false);
  }
});

testrunner.runner.TestRunnerBasic.start();
