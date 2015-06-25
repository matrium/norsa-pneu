/* jshint ignore:start */
(function($) {
    /**
     * French language package
     * Translated by @dlucazeau. Updated by @neilime, @jazzzz
     */
    FormValidation.I18n = $.extend(true, FormValidation.I18n, {
        'fr_FR': {
            base64: {
                'default': 'Veuillez rentrer une donnée correctement encodée en Base64'
            },
            between: {
                'default': 'Veuillez rentrer une valeur comprise entre %s et %s',
                notInclusive: 'Veuillez rentrer une valeur strictement comprise entre %s et %s'
            },
            bic: {
                'default': 'Veuillez rentrer un code-barre BIC valide'
            },
            callback: {
                'default': 'Veuillez rentrer une valeur valide'
            },
            choice: {
                'default': 'Veuillez rentrer une valeur valide',
                less: 'Veuillez choisir au minimum %s options',
                more: 'Veuillez choisir au maximum %s options',
                between: 'Veuillez choisir de %s à %s options'
            },
            color: {
                'default': 'Veuillez rentrer une couleur valide'
            },
            creditCard: {
                'default': 'Veuillez rentrer un numéro de carte de crédit valide'
            },
            cusip: {
                'default': 'Veuillez rentrer un code CUSIP valide'
            },
            cvv: {
                'default': 'Veuillez rentrer un code CVV valide'
            },
            date: {
                'default': 'Veuillez rentrer une date valide',
                'min': 'Veuillez rentrer une date supérieure à %s',
                'max': 'Veuillez rentrer une date inférieure à %s',
                'range': 'Veuillez rentrer une date comprise entre %s et %s'
            },
            different: {
                'default': 'Veuillez rentrer une valeur différente'
            },
            digits: {
                'default': 'Veuillez ne rentrer que des chiffres'
            },
            ean: {
                'default': 'Veuillez rentrer un code-barre EAN valide'
            },
            ein: {
                'default': 'Veuillez rentrer un code-barre EIN valide'
            },
            emailAddress: {
                'default': 'Veuillez rentrer une adresse e-mail valide'
            },
            file: {
                'default': 'Veuillez choisir un fichier valide'
            },
            greaterThan: {
                'default': 'Veuillez rentrer une valeur supérieure ou égale à %s',
                notInclusive: 'Veuillez rentrer une valeur supérieure à %s'
            },
            grid: {
                'default': 'Veuillez rentrer un code GRId valide'
            },
            hex: {
                'default': 'Veuillez rentrer un nombre hexadécimal valide'
            },
            iban: {
                'default': 'Veuillez rentrer un code IBAN valide',
                country: 'Veuillez rentrer un code IBAN valide pour %s',
                countries: {
                    AD: 'Andorre',
                    AE: 'Émirats Arabes Unis',
                    AL: 'Albanie',
                    AO: 'Angola',
                    AT: 'Autriche',
                    AZ: 'Azerbaïdjan',
                    BA: 'Bosnie-Herzégovine',
                    BE: 'Belgique',
                    BF: 'Burkina Faso',
                    BG: 'Bulgarie',
                    BH: 'Bahrein',
                    BI: 'Burundi',
                    BJ: 'Bénin',
                    BR: 'Brésil',
                    CH: 'Suisse',
                    CI: 'Côte d\'ivoire',
                    CM: 'Cameroun',
                    CR: 'Costa Rica',
                    CV: 'Cap Vert',
                    CY: 'Chypre',
                    CZ: 'République Tchèque',
                    DE: 'Allemagne',
                    DK: 'Danemark',
                    DO: 'République Dominicaine',
                    DZ: 'Algérie',
                    EE: 'Estonie',
                    ES: 'Espagne',
                    FI: 'Finlande',
                    FO: 'Îles Féroé',
                    FR: 'France',
                    GB: 'Royaume Uni',
                    GE: 'Géorgie',
                    GI: 'Gibraltar',
                    GL: 'Groënland',
                    GR: 'Gréce',
                    GT: 'Guatemala',
                    HR: 'Croatie',
                    HU: 'Hongrie',
                    IE: 'Irlande',
                    IL: 'Israël',
                    IR: 'Iran',
                    IS: 'Islande',
                    IT: 'Italie',
                    JO: 'Jordanie',
                    KW: 'Koweït',
                    KZ: 'Kazakhstan',
                    LB: 'Liban',
                    LI: 'Liechtenstein',
                    LT: 'Lithuanie',
                    LU: 'Luxembourg',
                    LV: 'Lettonie',
                    MC: 'Monaco',
                    MD: 'Moldavie',
                    ME: 'Monténégro',
                    MG: 'Madagascar',
                    MK: 'Macédoine',
                    ML: 'Mali',
                    MR: 'Mauritanie',
                    MT: 'Malte',
                    MU: 'Maurice',
                    MZ: 'Mozambique',
                    NL: 'Pays-Bas',
                    NO: 'Norvège',
                    PK: 'Pakistan',
                    PL: 'Pologne',
                    PS: 'Palestine',
                    PT: 'Portugal',
                    QA: 'Quatar',
                    RO: 'Roumanie',
                    RS: 'Serbie',
                    SA: 'Arabie Saoudite',
                    SE: 'Suède',
                    SI: 'Slovènie',
                    SK: 'Slovaquie',
                    SM: 'Saint-Marin',
                    SN: 'Sénégal',
                    TL: 'Timor oriental',
                    TN: 'Tunisie',
                    TR: 'Turquie',
                    VG: 'Îles Vierges britanniques',
                    XK: 'République du Kosovo'
                }
            },
            id: {
                'default': 'Veuillez rentrer un numéro d\'identification valide',
                country: 'Veuillez rentrer un numéro d\'identification valide pour %s',
                countries: {
                    BA: 'Bosnie-Herzégovine',
                    BG: 'Bulgarie',
                    BR: 'Brésil',
                    CH: 'Suisse',
                    CL: 'Chili',
                    CN: 'Chine',
                    CZ: 'République Tchèque',
                    DK: 'Danemark',
                    EE: 'Estonie',
                    ES: 'Espagne',
                    FI: 'Finlande',
                    HR: 'Croatie',
                    IE: 'Irlande',
                    IS: 'Islande',
                    LT: 'Lituanie',
                    LV: 'Lettonie',
                    ME: 'Monténégro',
                    MK: 'Macédoine',
                    NL: 'Pays-Bas',
                    PL: 'Pologne',
                    RO: 'Roumanie',
                    RS: 'Serbie',
                    SE: 'Suède',
                    SI: 'Slovénie',
                    SK: 'Slovaquie',
                    SM: 'Saint-Marin',
                    TH: 'Thaïlande',
                    ZA: 'Afrique du Sud'
                }
            },
            identical: {
                'default': 'Veuillez rentrer la même valeur'
            },
            imei: {
                'default': 'Veuillez rentrer un code IMEI valide'
            },
            imo: {
                'default': 'Veuillez rentrer un code IMO valide'
            },
            integer: {
                'default': 'Veuillez rentrer un nombre valide'
            },
            ip: {
                'default': 'Veuillez rentrer une adresse IP valide',
                ipv4: 'Veuillez rentrer une adresse IPv4 valide',
                ipv6: 'Veuillez rentrer une adresse IPv6 valide'
            },
            isbn: {
                'default': 'Veuillez rentrer un code ISBN valide'
            },
            isin: {
                'default': 'Veuillez rentrer un code ISIN valide'
            },
            ismn: {
                'default': 'Veuillez rentrer un code ISMN valide'
            },
            issn: {
                'default': 'Veuillez rentrer un code ISSN valide'
            },
            lessThan: {
                'default': 'Veuillez rentrer une valeur inférieure ou égale à %s',
                notInclusive: 'Veuillez rentrer une valeur inférieure à %s'
            },
            mac: {
                'default': 'Veuillez rentrer une adresse MAC valide'
            },
            meid: {
                'default': 'Veuillez rentrer un code MEID valide'
            },
            notEmpty: {
                'default': 'Veuillez remplir ce champ'
            },
            numeric: {
                'default': 'Veuillez rentrer une valeur décimale valide'
            },
            phone: {
                'default': 'Veuillez rentrer un numéro de téléphone valide',
                country: 'Veuillez rentrer un numéro de téléphone valide pour %s',
                countries: {
                    AE: 'les Émirats Arabes Unis',
                    BG: 'la Bulgarie',
                    BR: 'le Brésil',
                    CN: 'la Chine',
                    CZ: 'la République Tchèque',
                    DE: 'l\'Allemagne',
                    DK: 'le Danemark',
                    ES: 'l\'Espagne',
                    FR: 'la France',
                    GB: 'le Royaume-Uni',
                    IN: 'l\'Inde',
                    MA: 'le Maroc',
                    NL: 'les Pays-Bas',
                    PK: 'le Pakistan',
                    RO: 'la Roumanie',
                    RU: 'la Russie',
                    SK: 'la Slovaquie',
                    TH: 'la Thaïlande',
                    US: 'les USA',
                    VE: 'le Venezuela'
                }
            },
            promise: {
                'default': 'Veuillez rentrer une valeur valide'
            },
            regexp: {
                'default': 'Veuillez rentrer une valeur correspondant au modèle'
            },
            remote: {
                'default': 'Veuillez rentrer une valeur valide'
            },
            rtn: {
                'default': 'Veuillez rentrer un code RTN valide'
            },
            sedol: {
                'default': 'Veuillez rentrer a valid SEDOL number'
            },
            siren: {
                'default': 'Veuillez rentrer un numéro SIREN valide'
            },
            siret: {
                'default': 'Veuillez rentrer un numéro SIRET valide'
            },
            step: {
                'default': 'Veuillez rentrer un écart valide de %s'
            },
            stringCase: {
                'default': 'Veuillez ne rentrer que des caractères minuscules',
                upper: 'Veuillez ne rentrer que des caractères majuscules'
            },
            stringLength: {
                'default': 'Veuillez rentrer une valeur de longueur valide',
                less: 'Veuillez rentrer moins de %s caractères',
                more: 'Veuillez rentrer plus de %s caractères',
                between: 'Veuillez rentrer entre %s et %s caractères'
            },
            uri: {
                'default': 'Veuillez rentrer un URI valide'
            },
            uuid: {
                'default': 'Veuillez rentrer un UUID valide',
                version: 'Veuillez rentrer un UUID version %s number'
            },
            vat: {
                'default': 'Veuillez rentrer un code VAT valide',
                country: 'Veuillez rentrer un code VAT valide pour %s',
                countries: {
                    AT: 'Autriche',
                    BE: 'Belgique',
                    BG: 'Bulgarie',
                    BR: 'Brésil',
                    CH: 'Suisse',
                    CY: 'Chypre',
                    CZ: 'République Tchèque',
                    DE: 'Allemagne',
                    DK: 'Danemark',
                    EE: 'Estonie',
                    ES: 'Espagne',
                    FI: 'Finlande',
                    FR: 'France',
                    GB: 'Royaume-Uni',
                    GR: 'Grèce',
                    EL: 'Grèce',
                    HU: 'Hongrie',
                    HR: 'Croatie',
                    IE: 'Irlande',
                    IS: 'Islande',
                    IT: 'Italie',
                    LT: 'Lituanie',
                    LU: 'Luxembourg',
                    LV: 'Lettonie',
                    MT: 'Malte',
                    NL: 'Pays-Bas',
                    NO: 'Norvège',
                    PL: 'Pologne',
                    PT: 'Portugal',
                    RO: 'Roumanie',
                    RU: 'Russie',
                    RS: 'Serbie',
                    SE: 'Suède',
                    SI: 'Slovénie',
                    SK: 'Slovaquie',
                    VE: 'Venezuela',
                    ZA: 'Afrique du Sud'
                }
            },
            vin: {
                'default': 'Veuillez rentrer un code VIN valide'
            },
            zipCode: {
                'default': 'Veuillez rentrer un code postal valide',
                country: 'Veuillez rentrer un code postal valide pour %s',
                countries: {
                    AT: 'Autriche',
                    BG: 'Bulgarie',
                    BR: 'Brésil',
                    CA: 'Canada',
                    CH: 'Suisse',
                    CZ: 'République Tchèque',
                    DE: 'Allemagne',
                    DK: 'Danemark',
                    ES: 'Espagne',
                    FR: 'France',
                    GB: 'Royaume-Uni',
                    IE: 'Irlande',
                    IN: 'Inde',
                    IT: 'Italie',
                    MA: 'Maroc',
                    NL: 'Pays-Bas',
                    PL: 'Pologne',
                    PT: 'Portugal',
                    RO: 'Roumanie',
                    RU: 'Russie',
                    SE: 'Suède',
                    SG: 'Singapour',
                    SK: 'Slovaquie',
                    US: 'USA'
                }
            }
        }
    });
}(jQuery));
/* jshint ignore:end */
