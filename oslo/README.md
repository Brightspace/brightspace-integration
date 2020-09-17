# Off-Stack Langerm Overridest (OSLO)

The enclosed scripts build the integration files needed to support overriding
web component langterms in the LMS.

## generate-serge-mapping

Enumerates the node_modules dependencies looking for Serge configuration files.
Produces a mapping (".serge-mapping.json" in the repository root) of dependency
name to Serge config file.

Should be run when new components are added to BSI.

## generate-monolith-xml

Produces LMS definition/translation XMLs and an Oslo manifest file for the Serge
configuration files specified in ".serge-mapping.json". Should be run every
build, as output is synced to the monolith with the BSI version bump.

**Output:**

	build/
		langterms/
			D2L.LP.Oslo.config.json <---- Olso manifest
			definitions/
				WebComponents.xml <------ en definitions
			translations/
				fr-ca/
					WebComponents.xml <-- fr-CA translations
				<other-languages>/
					WebComponents.xml <-- Other translations
