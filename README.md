# xstate-model-testing-loading

This shows a number of really interesting things:
 - xstate with api call & loading indicator, then 2 terminal states
 - xstate with msw for the api call
 - controlling the msw response to be error in error state
 - controlling the msw response to be dependent upon the test
 - copying a test path so 2 different msw responses can be used for same state
 - problems with using deep merge to merge the test meta with the model and fallback to direct assignment
 