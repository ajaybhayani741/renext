import React from 'react'

import { entries } from '../utils/javascript'

const PrivacyPolicy = () => {
    const data = {
        "Definitions": [`“Contents” means information such as Images, Videos, Audios, Files of any format (PDF,
                        PPT, DOC etc.), Text, Software, Programs, Computer Code, and other information
                        captured/taken on the Service with objective of uploading and transmitting on the
                        Service.`,
            `“Submitted Contents” means Contents that Users have submitted, transmitted or
                        uploaded on or to the Services.`,
            `“Subject Contents” means the Contents accessed and consumed from the Submitted
                        Contents. `],
        "Agreement to these Terms and Conditions": [
            `All Users shall use the Services in accordance with these Terms and Conditions. Users
                may not use the Services unless they agree to these Terms and Conditions.`,
            `If Users will be using the Services on behalf of, or for the purposes of, a business
                enterprise, then such business enterprise must also agree to these Terms and
                Conditions  rior to using the Services.`,
            `Users who are minors may only use the Services by obtaining prior consent from their
                parents or legal guardians.`
        ],
        "Modification to these Terms and Conditions": [
            `These Terms and Conditions may be amended as new services, features, technology, or
            legal requirements arise or the like. Please check and review from time to time.`,
            `In case any significant updates or changes are made, Users will be notified of the same
            and in cases where it is required, we will make sure to take your consent.`,
            `In such case we will publicize the same to Users by notifying Users in the manner
            prescribed by Genbanext.`
        ],
        "User Account": [
            `When using the Services, Users may need to set up or will be set up by another User
            already registered with an account by registering certain information. Users must
            register true, accurate and complete information, and where required upload the
            necessary proof documents in the prescribed format and further must revise the same
            to keep such information up-to-date at all times.`,
            `Any User who has registered for the Services may delete such User’s account and cancel
            the Services at any time.`,
            `Genbanext reserves the right to delete any account that has been inactive for a period
            of three (3) years or more since its last activation, without any prior notice to the
            applicable User.`,
            `Any and all rights of a User to use the Service shall cease to exist when such User’s
            account has been deleted for any reason. Genbanext will continue to archive User
            accounts that have been deleted for a definite period of time as prescribed by
            Genbanext within which period the User can request to retrieve/restore their account.
            Please take note that beyond such a definite period an account cannot be retrieved
            even if a User had accidentally deleted their account.`,
            `Each account in the Services is for exclusive use and belongs solely to the intended User
            of such account. Users may not transfer, lease or otherwise dispose their rights to use
            the Service to any third party, nor may the same be inherited or succeeded to by any
            third party.`
        ],
        "Provision of the Service": [
            `Users shall supply PCs, mobile phone devices, smartphones and other communication
            devices, operating systems, communication methods, internet connectivity and
            electricity, etc. necessary for using the Services at their own responsibility and expense.`,
            `Genbanext reserves the right to limit access to all or part of the Services by Users
            depending upon conditions that Genbanext considers necessary, such as the
            identification of User, current registration status, and the like.`,
            `Genbanext reserves the right to modify, at Genbanext's discretion, all or part of the
            Services as Genbanext determines necessary anytime without any prior notice to Users.`,
            {
                [`Genbanext is always trying to improve our Services. That means we may expand, add, or
            remove our Services, features, functionalities, and the support of certain devices and
            platforms. Our Services may be interrupted, including for maintenance, repairs,
            upgrades, or network or equipment failures. We may discontinue some or all of our
            Services, including certain features and the support for certain devices and platforms, at 
            any time. Genbanext may cease providing all or part of the Services without any prior
            notice to Users in case of the occurrence of any of the following:`]: [
                        `When conducting maintenance or repair of systems;`,
                        `When the Services cannot be provided due to force majeure such as an
            accident (fire, power outage, etc.), act of God, war, riot, labor dispute;`,
                        `When there is system failure or heavy load on the system;`,
                        `When securing the safety of Users or third parties, or in the case of an
            emergency for the public welfare; or`
                    ]
            }
        ],
        "Rights and Licenses": [
            {
                "Users Rights:": [`Genbanext does not claim ownership of the information that Users
            submit for their Genbenext account or through our Services. Users must have
            the necessary rights to such information that they submit for their account or
            through our Services and the right to grant the rights and licenses in our Terms
            and Conditions.`]
            },
            {
                "Genbanext’s Rights:": [`Content Rights: While Users own the Content they store within the
            Services (subject to third party rights), Users acknowledge and agree that
            Genbanext (and our licensors) own(s) all legal right, title and interest in and to
            the Genbanext Service, including, without limitation, all software that is part of
            the Genbanext Service.`,
                    `Intellectual Property Rights: In agreeing to these Terms, Users also
            agree that the rights in the Genbanext Service, including all intellectual property
            rights, such as trademarks, patents, designs (including the web and mobile
            application screens and UI/UX designs) and copyrights, are protected by one or
            more of copyright, trademark, patent, trade secret and other laws, regulations
            and treaties, in addition to these Terms and Conditions and any Separate
            Agreement. In particular, Users agree to not modify, create derivative works of,
            decompile or otherwise attempt to extract source code from any Genbanext
            Software, unless they are expressly permitted to do so under an open source
            license or Genbanext gives you express written permission to do so
            notwithstanding this prohibition.`,
                    `Right to modify the Genbanext Service: We retain the right, in our sole
            discretion, to implement new elements as part of and/or ancillary to the existing
            Genbanext Service, including changes that may affect the previous mode of
            operation of the Genbanext Service. We expect that any such modifications will 
            enhance the overall Genbanext Service. This modification may or may not be
            notified in advance to the existing users.`,
                    `Right to engage Third Parties: Genbanext engages certain affiliates or
            other third parties (“Service Providers”) to provide technical or other services
            relating to all or part of the Genbanext Service, and Users hereby agree that
            such involvement by these Service Providers is acceptable.`,
                    `Right to use Third Party Software: Genbanext may from time to time
            include as part of the Genbanext Service computer software supplied by third
            parties which is utilized by permission of the respective licensors and/or
            copyright holders on the terms provided by such parties. We provide
            information about some of this third-party software here and within the
            particular Genbanext Software. Genbanext expressly disclaims any warranty or
            other assurance to Users regarding such third-party software.`,
                    `Right to update Genbabext Software: In connection with any
            modification of the Genbanext Service, Genbanext may automatically download
            software updates on your computers and devices from time to time with the
            intention of improving, enhancing, repairing and/or further developing the
            Genbanext Service. Genbanext will endeavor to provide you with the option of
            whether or not to install the update; however, in certain circumstances (e.g.,
            security risks), Genbanext may require you to install the update to continue
            accessing the Genbanext Service. In all cases, you agree to permit Genbanext to
            deliver these updates to you (and you to receive them) as part of your use of
            the Genbanext Service.`]
            },
            {
                "User’s License to Genbanext:": [
                    `In order to operate and provide our Services, Users grant Genbanext a
            worldwide, non-exclusive, royalty-free, sublicensable, and transferable license
            to use, reproduce, distribute, create derivative works of, display, and perform
            the information (including the Contents) that Users upload, submit, store, send,
            or receive on or through our Services. The rights Users grant in this license are
            for the limited purpose of operating and providing our Services (such as to allow
            us to display Users profile pictures, profile data, activity and jobs data, reviews
            and rating data etc., transmit Users Jobs and Job details, store this Users
            generated data on our servers for a limited amount of time to be accessible,
            archived and referred to from time to time, and the like).`
                ]
            },
            {
                "Genbenext’s License to User:": [
                    ` Genbanext grants Users a limited, revocable, non-exclusive, nonsublicensable, and non-transferable license to use our Services, subject to and in
            accordance with our Terms. This license is for the sole purpose of enabling
            Users to use our Services in the manner permitted by our Terms. No licenses or 
            rights are granted to Users by implication or otherwise, except for the licenses
            and rights expressly granted to them.`
                ]
            }
        ],
        "No Access to Emergency Call Functions and Services": [
            `There are important differences between our Services and Users mobile phone and a
            fixed-line telephone and SMS services. Our Services do not provide access to emergency
            services or emergency services providers, including the police, fire departments, or
            hospitals, or otherwise connect to public safety answering points. Users should ensure
            they can contact their relevant emergency services providers through a mobile phone, a
            fixed-line telephone, or other service.`
        ],
        "Privacy Policy and User Data": [
            `Collection of Information: Genbanext must receive or collect some information to
            operate, provide, improve, understand, customize, support, and market our Services,
            including when Users install, access, or use our Services.`,
            {
                ". Information Users Provide:": [
                    `User Account Information: Users must provide their First and Last
            names, email address, mobile phone number, affiliated business name and
            other basic information (including a profile name/user name and password of
            their choice) to create a Genbanext account. Furthermore, we require specific
            data related to the Role the User is registering for (Ex. In case of a Contractor
            Role User we will need their State/Prefecture-wise business permission
            registration numbers to validate the authenticity of the Contractor as well as the
            skills/certifications they claim to be having in order to provide services to other
            Users of the Genbanext service). If you don’t provide us with this information,
            you will not be able to create an account to use our Services. You can add and
            update this and any other information to your account, such as a profile picture
            and "about" information at any point of time after the initial registration with
            some mandatory data fields.`,
                    `User Activity, Interactions: We capture and retain any activity and
            interactions of Users with other Users on the Genbanext Service. (Ex. A Job
            requested and executed between a Contractor Role User and Recycle Factory
            Role User is given a specific identification number on Genbanext and this data is
            saved on our servers so that each of the parties involved in this activity has
            access to current state as well as a reference access to this once the activity is
            completed in the form of archived or historical data).`,
                    `User Connections: Users can connect with other Users in specific ways
            like a Parent-Child relationship, Association relationship etc. In all such cases,
            we maintain and save on our servers this connections data.`,
                    `Customer Support and other communications: When Users contact us
            for customer support or otherwise communicate with us, they may provide us
            with information related to their use of our Services, including copies of their
            activity, jobs, connections, any other information they deem helpful, and how to
            contact them back (e.g., an email address). For example, they may send us an
            email with information relating to app performance or other issues.`
                ]
            },
            {
                "Information we Automatically Collect:": [
                    `Usage and Log Information: We collect information about Users activity
            on our Services, like service-related, diagnostic, and performance information.
            This includes information about their activity (including how they use our
            Services, their Services settings, their connections, how they interact with
            others using our Services, and the time, frequency, and duration of their
            activities and interactions), log files, and diagnostic, crash, website, and
            performance logs and reports. This also includes information about when they
            registered to use our Services; the features they use like our User Management
            and Connectivity, Tools Management, Tools Rentals, Building Management,
            Equipment Management, Job Management, Auto-Generation of Job completion
            Reports and Certificates, Reports and Map-Based Data Visualization, profile
            photo, "about" profile information; whether they are online, when they last
            used our Services; and when they last updated their "about" information and
            the like.`,
                    `Device and Connection Information: We collect device and connectionspecific information when Users install, access, or use our Services. This includes
            information such as hardware model, operating system information, battery
            level, signal strength, app version, browser information, mobile network,
            connection information (including phone number, mobile operator or ISP),
            language and time zone, IP address, and device operations information.`,
                    `Location Information: We collect and use precise location information
            from Users device with their permission when they choose to use locationrelated features, like when Users would like to filter Connections, Customers,
            Buildings or Jobs based on the vicinity they are located in, look for connections
            in the vicinity or filter the Map-Based View depending on their current location.
            There are certain settings relating to location-related information which you can
            find in your device settings or the in-app settings, such as location sharing. Even
            if they do not use our location-related features, we use IP addresses and other
            information like phone number area codes or their registration address pin
            codes to estimate their general location (e.g., ward/city/town, city and country
            levels).`
                ]
            },
            {
                "How we use the information users provide and that we automatically collect:": [
                    `Our Services: We use information we have to operate and provide our
            Services, further customize to better fit each individual users specific needs and 
            use cases, including providing customer support; improving, fixing, and
            customizing our Services. We also use information we have to understand how
            people use our Services; evaluate and improve our Services; research, develop,
            and test new services and features; and conduct troubleshooting activities. We
            also use their information to respond to them when they contact us.`,
                    `Safety, Security and Integrity: Safety, security and integrity are an
            integral part of our Services. We use information we have to verify accounts and
            activity; combat harmful conduct; protect users against bad experiences and
            spam; and promote safety, security and integrity on and off our Services, such
            as by investigating suspicious activity or violations of our Terms and policies,
            and to ensure our Services are being used legally. `
                ]
            },
            {
                "Law and Protection:": [
                    `We access, preserve, and share users information described in the
            "Information Users Provide" section of this Privacy Policy above if we have a
            good-faith belief that it is necessary to: (a) respond pursuant to applicable law
            or regulations, legal process, or government requests; (b) enforce our Terms
            and any other applicable terms and policies, including for investigations of
            potential violations; (c) detect, investigate, prevent, or address fraud and other
            illegal activity or security and technical issues; or (d) protect the rights, property,
            and safety of our users, or others.`
                ]
            },
            {
                "Storage Location of Data": [
                    `To provide our Services in a reliable and responsible manner, Genbanext
            processes and stores Personal Data as well as all other related data on secure
            servers located in the country in which we are providing the service. (Ex. For the
            Genbanext Users located anywhere in Japan all their User Data, Profile Data,
            Activity and Jobs data as well as all other related data is physically located on
            our secure servers physically located in Tokyo, Japan)`
                ]
            }
        ],
        "Acceptable Use of Our Services": [
            `Abide by Terms and Conditions: Users must use our Services according to our Terms and
            Conditions and posted policies. If they violate our Terms and Conditions or policies, we
            may take action with respect to their account, including disabling or suspending their
            account and, if we do, they agree not to create another account without our permission.`,
            `Legal and Acceptable Use: Users must access and use our Services only for legal,
            authorized, and acceptable purposes.`,
            `Harm to Genbanext or Other Users: Users must not (or assist others to) directly,
            indirectly, through automated or other means, access, use, copy, adapt, modify, prepare
            derivative works based upon, distribute, license, sublicense, transfer, display, perform,
            or otherwise exploit our Services in impermissible or unauthorized manners, or in ways 
            that burden, impair, or harm us, our Services, systems, our users, or others, including
            that they must not directly or through automated means: (a) reverse engineer, alter,
            modify, create derivative works from, decompile, or extract code from our Services; (b)
            send, store, or transmit viruses or other harmful computer code through or onto our
            Services; (c) gain or attempt to gain unauthorized access to our Services or systems; (d)
            interfere with or disrupt the safety, security, confidentiality, integrity, availability, or
            performance of our Services; (e) create accounts for our Services through unauthorized
            or automated means; (f) collect information of or about our users in any impermissible
            or unauthorized manner; (g) sell, resell, rent, or charge for our Services or data obtained
            from us or our Services in an unauthorized manner; (h) distribute or make our Services
            available over a network where they could be used by multiple devices at the same
            time, except as authorized through tools we have expressly provided via our Services; (i)
            create software or APIs that function substantially the same as our Services and offer
            them for use by third parties in an unauthorized manner; or (j) misuse any reporting
            channels, such as by submitting fraudulent or groundless reports or appeals.`,
            `Keeping your account secure: Users are responsible for keeping their device and their
            Genbanext accounts safe and secure, and they must notify us promptly of any
            unauthorized use or security breach of their account or our Services.`
        ],
        "Restricted Matters: Genbanext prohibits Users from engaging in any of the following acts when using our Services: ": [
            `Acts that violate the laws and regulations, court verdicts, resolutions or orders,
            or administrative measures that are legally binding;`,
            `Acts that may be in violation of public order, morals or customs;`,
            `Acts that infringe intellectual property rights, such as copyrights, trademarks
            and patent rights, rights to privacy, and all other rights granted by law or by a contract
            with Genbanext and/or a third party;`,
            `Acts of unauthorized or improper collection, disclosure, or provision of any
            other person's personal information, registered information, user history, or the like;`,
            `Acts of interfering with the servers and/or network systems of the Services;
            fraudulently manipulating the Services by means of crawlers, bots, cheat tools, or other
            technical measures both manual or automated; deliberately using defects of the
            Services; making unreasonable inquires and/or undue claims such as repeatedly asking
            the same questions beyond what is necessary, and other acts of interfering with or
            hindering Genbanext's operation of the Services or other Users’ use of the Services;`,
            `Acts of decoding the source code of the Services, such as by way of reverse
            engineering, disassembling or the like, for unreasonable purposes or in an unfair
            manner;`,
            `Acts of uploading or transmitting excessively violent or explicit sexual
            expressions; expressions that amount to child pornography or child abuse; expressions
            that lead to discrimination by race, national origin, creed, gender, social status, family
            origin, etc.; expressions that induce or encourage suicide, self-injurious behavior or drug
            abuse; or expressions that include anti-social content and lead to the discomfort of
            others;`,
            `Acts of sending illegal or impermissible communications such as bulk messaging,
            auto-messaging, auto-dialing, and the like deemed by Genbanext to constitute
            spamming;`,
            `Acts of using the Services for sales, marketing, advertising, solicitation or other
            commercial purposes (except for those approved by Genbanext); using the Services for
            the purpose of sexual conduct or obscene acts; using the Services for the purpose of
            meeting or engaging in sexual encounters with an unknown third party; using the
            Services for the purpose of harassment or libelous attacks against other Users; or
            otherwise using the Services for purposes other than as intended by the Services;`,
            `Acts that benefit or involve collaboration with anti-social groups;`
        ],
        "User Responsibility": [
            `Users shall use the Services at their own risk, and shall bear any and all
            responsibilities for actions carried out under and the results from the use of the
            Services.`
        ],
        "Indemnity": [
            `You agree to indemnify and hold Genbanext, its subsidiaries, affiliates, officers,
            agents, employees, advertisers, Service Providers and other partners harmless from and
            against any and all claims, liabilities, damages (actual and consequential), losses and
            expenses (including legal and other professional fees) arising from or in any way related
            to any third party claims relating to your use of any of the Services, any violation of
            these Terms and Conditions of Use or any other actions connected with your use of the
            Services (including all actions taken under your account). In the event of such claim, we
            will endeavor to provide notice of the claim, suit or action to the contact information we
            have for the account, provided that any failure to deliver such notice to you shall not
            eliminate or reduce your indemnification obligation hereunder.`
        ],
        "No Warranty": [
            `GENBANEXT DOES NOT WARRANT THAT (i) THE GENBANEXT SERVICE WILL
            MEET ALL OF YOUR REQUIREMENTS; (ii) THE GENBANEXT SERVICE WILL BE 
            UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE; OR (iii) ALL ERRORS IN THE
            GENBANEXT SOFTWARE OR GENBANEXT SERVICE WILL BE CORRECTED.`
        ],
        "Genbanext’s Limitation of Liability": [
            `YOUR USE OF THE GENBANEXT SERVICE AND THE PURCHASE AND USE OF ANY
            SERVICES ARE ALL AT YOUR SOLE RISK.`,
            `THE GENBANEXT SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE”
            BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, GENBANEXT EXPRESSLY
            DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND
            CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`,
            `ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE
            OF THE GENBANEXT SERVICE IS DONE AT YOUR OWN DISCRETION AND RISK AND YOU
            ARE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER OR OTHER DEVICE
            OR LOSS OF DATA RESULTING FROM THE DOWNLOAD OR USE OF ANY SUCH MATERIAL.`,
            `NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY
            YOU FROM GENBANEXT OR THROUGH OR FROM THE GENBANEXT SERVICE SHALL
            CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS OF SERVICE.`,
            `YOU EXPRESSLY UNDERSTAND AND AGREE THAT GENBANEXT, ITS SUBSIDIARIES,
            AFFILIATES, SERVICE PROVIDERS, AND LICENSORS, AND OUR AND THEIR RESPECTIVE
            OFFICERS, EMPLOYEES, AGENTS AND SUCCESSORS SHALL NOT BE LIABLE TO YOU FOR
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY
            DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS,
            GOODWILL, USE, DATA, COVER OR OTHER INTANGIBLE LOSSES (EVEN IF GENBANEXT
            HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES) RESULTING FROM: (i) THE
            USE OR THE INABILITY TO USE THE GENBANEXT SERVICE; (ii) THE COST OF
            PROCUREMENT OF SUBSTITUTE SERVICES RESULTING FROM ANY DATA, INFORMATION
            OR SERVICE PURCHASED OR OBTAINED OR MESSAGES RECEIVED OR TRANSACTIONS
            ENTERED INTO THROUGH OR FROM THE GENBANEXT SERVICE; (iii) UNAUTHORIZED
            ACCESS TO OR THE LOSS, CORRUPTION OR ALTERATION OF YOUR TRANSMISSIONS,
            CONTENT OR DATA; (iv) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON OR USING
            THE GENBANEXT SERVICE, OR PROVIDING ANY SERVICES RELATED TO THE OPERATION
            OF THE GENBANEXT SERVICE; (v) GENBANEXT’S ACTIONS OR OMISSIONS IN RELIANCE
            UPON YOUR BASIC SUBSCRIBER INFORMATION AND ANY CHANGES THERETO OR
            NOTICES RECEIVED THEREFROM; (vi) YOUR FAILURE TO PROTECT THE CONFIDENTIALITY
            OF ANY PASSWORDS OR ACCESS RIGHTS TO YOUR ACCOUNT; (vii) THE ACTS OR
            OMISSIONS OF ANY THIRD PARTY USING OR INTEGRATING WITH THE GENBANEXT
            SERVICE; (viii) ANY ADVERTISING CONTENT OR YOUR PURCHASE OR USE OF ANY
            ADVERTISED OR OTHER THIRD-PARTY PRODUCT OR SERVICE; (ix) THE TERMINATION OF 
            YOUR ACCOUNT IN ACCORDANCE WITH THE TERMS OF THESE TERMS OF SERVICE; OR
            (x) ANY OTHER MATTER RELATING TO THE GENBANEXT SERVICE.`
        ],
        "Notification and Contact": [
            `For notifications from Genbanext to Users regarding the Services, Genbanext
            will use a method that Genbanext considers appropriate, such as posting in an
            appropriate section of the Web and Mobile Application, within the Services or on the
            Genbanext website.`,
            `For notifications from Users to Genbanext regarding the Services, Users shall
            use the details in the “Contact Us” section of the website, specifically contact on this
            email id: info@genbanext.com or on this phone: +81-080-8529-3858.`
        ]
    }

    return (
        <div className="privacy-policy">
            <h2 className="page-title"><b>GenbaNEXT Terms and Conditions of Use & Privacy Policy</b></h2>
            <div className="text-end"><b>Last Updated On: 25<sup>th</sup> May, 2023</b></div>
            <p className="mt-15">These Genbanext Terms and Conditions of Use (these “Terms and Conditions“) set forth the terms and
                conditions for the use of any and all products and services including the website
                “https://genbanext.com/” (collectively, the “Services”) provided by Genbanext Technologies Private
                Limited (“Genbanext“) to users of the Services (the “User“ or “Users“, depending upon the context). The
                Users’ usage of the Services is subject to their agreement with these Terms and Conditions.</p>
            <div className="order-parent">
                <ol>
                    {entries(data).map(([key, value], index) => {
                        return (
                            <li key={index}>
                                {key}
                                <ol>
                                    {
                                        value.map((val, ind) => {
                                            if (typeof val === "string") {
                                                return <li key={ind}>{val}</li>
                                            } else {
                                                return entries(val).map(([k, v], i) => {
                                                    return (<li key={i}>{k}
                                                        <ol>
                                                            {v.map((v1, i1) => {
                                                                return <li key={i1}>{v1}</li>
                                                            })}
                                                        </ol>
                                                    </li>)
                                                })
                                            }
                                        })
                                    }
                                </ol>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}

export default PrivacyPolicy