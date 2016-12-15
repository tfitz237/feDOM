(function(){
	'use strict'

	function dom() {
		var self = this;

		self.vars  = {
			count: 0,
			name: "Default value"
		};
		self.fn = {
			inc: (vari, count) =>{
				self.vars[vari] += parseInt(count);
			},
			incOne: () => self.vars["count"]++
		};
		let body = document.querySelectorAll("body");
		self.dom = body[0];
		for(var i = 0; i < self.dom.children.length; i++) {
			let child = self.dom.children[i];
			for(var j = 0; j < child.attributes.length; j++) {
				let attr = child.attributes[j];
				let vari = attr.value;
				switch(attr.name) {
					case "click":
						let fn = attr.value.match(/([A-Za-z0-9]+)/g);
						let func = "";
						if(fn.length == 1) {
							func = "self.fn."+fn[0]+"()";
						} else {
							func = "self.fn."+fn[0]+"(";
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
									child.addEventListener("input", (e) => {
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
							self.vars.watch(vari, (id, oldVal, newVal) => {
								child.innerHTML = newVal;

								return newVal;
							});
						}
						break;
					case "show":
						child.oldDisplay = window.getComputedStyle(child).getPropertyValue('display');
						if(self.vars[vari]) {
							child.style.display = "inline";
						} else {
							child.style.display = "none";
						}
						self.vars.watch(vari, (id, oldVal, newVal) => {
							if(newVal) {
								child.style.display = child.oldDisplay;
							} else {
								child.style.display = "none";
							}

							return newVal;
						});
						break;
				}
			}
		}
	}
	new dom();
})();
