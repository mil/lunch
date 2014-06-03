#!/usr/bin/env ruby
require 'yaml'

$config_file = "/home/mil/.configuration.yaml"
$config = YAML.load_file $config_file

# Executing shorthands
if $config['Shorthands'].keys.include? ARGV[0]
  %x[#{$config['Shorthands'][ARGV[0]]}]
else
  # Determine Filters 
  $filters = []
  ARGV.each_with_index do |arg, i|
    if $config['Filters'].keys.include? arg
      ARGV.delete_at i
      $filters.push $config['Filters'][arg]
    end
  end
  $filters.push $config['Filters'][$config['Filters']['default']] if $filters.length < 1
  
  # Determine Handlers
  $handlers = []
  ARGV.each_with_index do |arg, i|
    if $config['Handlers'].keys.include? arg
      ARGV.delete_at i
      $handlers.push $config['Handlers'][arg]
    end
  end
  $handlers.push $config['Handlers'][$config['Handlers']['default']] if $handlers.length < 1

  args = ""
  if $filters[0].include? "://"
    space = "%20"
  else
    space = " "
  end

  ARGV.each { |arg| args += "#{arg}#{space}" }
  command = $filters[0].gsub '%s', args
  %x[#{$handlers[0].gsub '%s', command}]
end
