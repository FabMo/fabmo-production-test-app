
fabmo-production-test-app.fma: clean node-modules *.html js/*.js js/lib/*.js tests/*.js tests/sbp/*.sbp tests/images/*.jpg tests/images/*.png css/*.css icon.png images/*.png package.json
	zip fabmo-production-test-app.fma *.html js/*.js js/lib/*.js css/*.css tests/*.js tests/sbp/*.sbp tests/images/*.jpg tests/images/*.png images/*.png icon.png package.json
	zip fabmo-production-test-app.fma -r node_modules/font-awesome/css node_modules/font-awesome/fonts node_modules/bulma/css

node-modules:
	npm install

.PHONY: clean node-modules

clean:
	rm -rf fabmo-production-test-app.fma
