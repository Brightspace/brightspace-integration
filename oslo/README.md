# Off-Stack Langerm Overrides (OSLO)

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

Note: The LMS `LANG_OBJECTS` table is not able to store certain special characters like `@`. It will do a conversion to a unicode representation like `\u0040`. For this reason if there is a special character in the package/collection/term name support needs to be added to the OSLO controller in the LMS to parse that character.

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
