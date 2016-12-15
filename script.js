(function(){
	'use strict'
	var feDOM = new feDOM({
		vars: {
					count: 0,
					name: "Default value"
		},
		functions: {
			inc: (vari, count) =>{
				feDOM.vars[vari] += parseInt(count);
			},
			incOne: () => feDOM.vars["count"]++
		}
	});

	function feDOM(constructor) {
		'use strict'
		var self = this;
		init();

		function init() {
			self.vars = constructor.vars;
			self.functions = constructor.functions;
			self.watchers = {};
			self.dom = document.querySelectorAll("body")[0];

			findExpressions();
			findAttributes(self.dom);
			setupWatchers();
		}

		function findAttributes(dom) {
			for(var i = 0; i < dom.children.length; i++) {
				let child = dom.children[i];
				bindAttributes(child);
				if (child.children.length > 0) {
					findAttributes(child);
				}
			}
		}

		function bindAttributes(child) {
			for(var j = 0; j < child.attributes.length; j++) {
				let attr = child.attributes[j];
				let vari = attr.value;
				switch(attr.name) {
					case "click":
						let fn = attr.value.match(/([A-Za-z0-9]+)/g);
						let func = "";
						if(fn.length == 1) {
							func = "self.functions."+fn[0]+"()";
						} else {
							func = "self.functions."+fn[0]+"(";
							for(var k = 1; k < fn.length; k++) {
								func += "\""+fn[k]+"\"";
								func += (k != fn.length - 1) ? "," : "";
							}
							func += ")";
						}
						child.addEventListener("click", () => {eval(func); });
						break;
					case "var":
						if(child.nodeName =="INPUT") {
							child.value = self.vars[vari];
							switch(child.type) {
								case "text":
									child.addEventListener("keyup", (e) => {
										self.vars[vari] = child.value;
									});
									break;
								case "checkbox":
									child.addEventListener("change", (e) => {
										self.vars[vari] = child.checked;
									});
									break;
							}

						} else {
							child.innerHTML = self.vars[vari];
							if(self.watchers[vari]) {
								self.watchers[vari].push({child: child, type: "var"});
							} else {
								self.watchers[vari] = [{child: child, type: "var"}];
							}
							console.log('adding watcher for ' + vari);
						}
						break;
					case "show":
						child.oldDisplay = window.getComputedStyle(child).getPropertyValue('display');
						if(self.vars[vari]) {
							child.style.display = child.oldDisplay;
						} else {
							child.style.display = "none";
						}
						if(self.watchers[vari]) {
							self.watchers[vari].push({child: child, type: "show"});
						} else {
							self.watchers[vari] = [{child: child, type: "show"}];
						}

						break;
					case "eval":
						var type = vari.match(/([A-Za-z]+)/g);
						if(type == null) {
							child.innerHTML = eval(vari);
						} else {
							child.innerHTML = eval(vari.replace(/(\w)+/g, (match) => {
								if(self.watchers[match]) {
									self.watchers[match].push({child: child, type: "eval"});
								} else {
									self.watchers[match] = [{child: child, type: "eval"}];
								}
								return "self.vars."+match;
							}
							));
						}
						break;
					case "once":
						child.innerHTML = self.vars[vari];
						break;

				}
			}
		}
		function findExpressions() {
			self.dom.innerHTML = self.dom.innerHTML.replace(/{{(\w+)}}/g,
			(match) => { return "<span var=\""+match.substring(2, match.length - 2)+"\"></span>"});
			self.dom.innerHTML = self.dom.innerHTML.replace(/{\[.+\]}/g, (match) => {
				return "<span eval=\""+match.substring(2, match.length - 2)+"\"></span>"});
				self.dom.innerHTML = self.dom.innerHTML.replace(/{\(.+\)}/g, (match) => {
					return self.vars[match.substring(2, match.length - 2)]});

		};
		function setupWatchers() {
				for(let prop in self.watchers) {
					self.vars.watch(prop, (id, oldVar, newVar) => {
							self.watchers[prop].forEach((watcher) => {
								if(watcher.type == "var") {
									watcher.child.innerHTML = newVar;
								} else if(watcher.type == "show") {
									if(newVar) {
										watcher.child.style.display = watcher.child.oldDisplay;
									} else {
										watcher.child.style.display = "none";
									}
								} else if (watcher.type == "eval") {
									watcher.child.innerHTML = eval(watcher.child.attributes["eval"].value.replace(/(\w)+/g, "self.vars.$&"));
								}
							});

						return newVar;
					});
				}
		}
	}
})();
