'use strict'

// for use of internal functions/vars,
// use the name of the variable you have declared

// Construction methods:
// All in one constructor

var app = new feDOM({
	vars: {
		count: 0,
		name: "Default value"
	},
	functions: {
		inc:  function(vari, count) {
			app.vars[vari] += parseInt(count);
		},
		incOne: () => app.vars["count"]++
	}
});

// One by one, then init();

// var app = new feDOM();
// app.vars = {
// 	count: 0,
// 	name: "Default value"
// };
// app.functions = {
// 	inc:  function(vari, count) {
// 		app.vars[vari] += parseInt(count);
// 	},
// 	incOne: () => app.vars["count"]++
//
// };
// app.init();
