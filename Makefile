fabmo-boxcutter-app.fma: clean *.html js/*.js js/lib/*.js node_modules/* tests/*.js tests/sbp/*.sbp tests/images/*.jpg css/*.css icon.png images/*.png package.json
	zip fabmo-production-test-app.fma *.html js/*.js js/lib/*.js css/*.css tests/*.js tests/sbp/*.sbp tests/images/*.jpg images/*.png icon.png package.json
	zip fabmo-production-test-app.fma -r node_modules/font-awesome/css node_modules/font-awesome/fonts node_modules/bulma/css

.PHONY: clean

clean:
	rm -rf fabmo-production-test-app.fma
