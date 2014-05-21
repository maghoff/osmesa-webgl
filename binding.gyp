{
	'targets': [
		{
			'target_name': 'webgl',
			'sources': [ 
				'src/bindings.cc',
				'src/webgl.cc',
			],
			'include_dirs': [
				'<!(node -e "require(\\"nan\\")")',
				'<(module_root_dir)/Mesa-10.1.0/include',
			],
			'libraries': [
				'-lOSMesa', '-L<(module_root_dir)/Mesa-10.1.0/lib/gallium',
				'-ltinfo'
			],
			'ldflags': [
				'-Wl,-rpath,\$$ORIGIN/../../Mesa-10.1.0/lib/gallium',
			]
		}
	]
}
