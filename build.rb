puts "Building..."
puts "Minify"
%x(uglifyjs ajax.js -o ajax.min.js)