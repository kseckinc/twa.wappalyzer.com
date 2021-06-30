<template>
  <div>
    <v-card class="my-4" tile>
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
          Lookup
        </div>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          :disabled="isLoading"
          @submit.prevent="submit"
        >
          <p class="mb-6">
            Enter a website URL to reveal the technology stack, metadata and
            company and contact details.
          </p>

          <v-text-field
            ref="url"
            v-model="url"
            hide-details="auto"
            label="Enter a website URL"
            placeholder="https://www.example.com"
            type="url"
            outlined
            :append-icon="mdiMagnify"
            :rules="urlRules"
            :hint="
              !isLoading && isSignedIn
                ? `You have ${parseFloat(
                    credits || 0
                  ).toLocaleString()} credits remaining.`
                : ''
            "
            @click:append="submit"
            @focus="$event.target.select()"
          />
        </v-form>

        <v-alert v-if="error" color="info" class="mt-4 mb-0" outlined>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>

    <v-card v-if="loading" class="my-4" tile>
      <v-card-text class="d-flex justify-center">
        <Progress />
      </v-card-text>
    </v-card>

    <svg
      v-if="(!loading || !url) && !technologies.length"
      width="100%"
      viewBox="0 0 751 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="pa-4 mx-auto d-block"
      style="max-width: 400px"
    >
      <g clip-path="url(#clip0)">
        <rect width="751" height="600"></rect>
        <path
          d="M37.1429 256C46.9938 256 56.4412 259.908 63.4068 266.864C70.3725 273.821 74.2857 283.256 74.2857 293.093C74.2857 302.281 70.9143 310.727 65.3714 317.233L66.9143 318.773H71.4286L100 347.307L91.4286 355.867L62.8571 327.333V322.825L61.3143 321.284C54.8 326.82 46.3429 330.187 37.1429 330.187C27.292 330.187 17.8445 326.279 10.8789 319.322C3.91325 312.366 0 302.931 0 293.093C0 283.256 3.91325 273.821 10.8789 266.864C17.8445 259.908 27.292 256 37.1429 256V256ZM37.1429 267.413C22.8571 267.413 11.4286 278.827 11.4286 293.093C11.4286 307.36 22.8571 318.773 37.1429 318.773C51.4286 318.773 62.8571 307.36 62.8571 293.093C62.8571 278.827 51.4286 267.413 37.1429 267.413Z"
          fill="#4608AD"
        ></path>
        <path
          d="M224 306L199 291.566V320.434L224 306ZM120 308.5H122.6V303.5H120V308.5ZM127.8 308.5H133V303.5H127.8V308.5ZM138.2 308.5H143.4V303.5H138.2V308.5ZM148.6 308.5H153.8V303.5H148.6V308.5ZM159 308.5H164.2V303.5H159V308.5ZM169.4 308.5H174.6V303.5H169.4V308.5ZM179.8 308.5H185V303.5H179.8V308.5ZM190.2 308.5H195.4V303.5H190.2V308.5ZM200.6 308.5H205.8V303.5H200.6V308.5ZM211 308.5H216.2V303.5H211V308.5Z"
          fill="#A283D6"
        ></path>
        <path
          d="M598.5 552.5L573.5 538.066V566.934L598.5 552.5ZM424.5 306H426.792V301H424.5V306ZM431.375 306H435.958V301H431.375V306ZM440.542 306H445.125V301H440.542V306ZM449.708 306H454.292V301H449.708V306ZM458.875 306H463.458V301H458.875V306ZM468.042 306H472.625V301H468.042V306ZM477.208 306H479.5V301H477.208V306ZM479.5 306C480.228 306 480.949 306.028 481.662 306.084L482.05 301.099C481.208 301.033 480.358 301 479.5 301V306ZM485.925 306.754C487.337 307.092 488.707 307.539 490.026 308.086L491.941 303.467C490.381 302.82 488.76 302.291 487.088 301.891L485.925 306.754ZM493.869 310.047C495.099 310.803 496.266 311.653 497.359 312.588L500.608 308.787C499.318 307.684 497.939 306.68 496.485 305.787L493.869 310.047ZM500.412 315.641C501.347 316.734 502.197 317.901 502.953 319.131L507.213 316.515C506.32 315.061 505.316 313.682 504.213 312.392L500.412 315.641ZM504.914 322.974C505.461 324.293 505.908 325.663 506.246 327.075L511.109 325.912C510.709 324.24 510.18 322.619 509.533 321.059L504.914 322.974ZM506.916 331.338C506.972 332.051 507 332.772 507 333.5H512C512 332.642 511.967 331.792 511.901 330.95L506.916 331.338ZM507 333.5V335.987H512V333.5H507ZM507 340.961V345.934H512V340.961H507ZM507 350.908V355.882H512V350.908H507ZM507 360.855V365.829H512V360.855H507ZM507 370.803V375.776H512V370.803H507ZM507 380.75V385.724H512V380.75H507ZM507 390.697V395.671H512V390.697H507ZM507 400.645V405.618H512V400.645H507ZM507 410.592V415.566H512V410.592H507ZM507 420.539V425.513H512V420.539H507ZM507 430.487V435.461H512V430.487H507ZM507 440.434V445.408H512V440.434H507ZM507 450.382V455.355H512V450.382H507ZM507 460.329V465.303H512V460.329H507ZM507 470.276V475.25H512V470.276H507ZM507 480.224V485.197H512V480.224H507ZM507 490.171V495.145H512V490.171H507ZM507 500.118V505.092H512V500.118H507ZM507 510.066V515.039H512V510.066H507ZM507 520.013V522.5H512V520.013H507ZM507 522.5C507 523.358 507.033 524.208 507.099 525.05L512.084 524.662C512.028 523.949 512 523.228 512 522.5H507ZM507.891 530.088C508.291 531.76 508.82 533.381 509.467 534.941L514.086 533.026C513.539 531.707 513.092 530.337 512.754 528.925L507.891 530.088ZM511.787 539.485C512.68 540.939 513.684 542.318 514.787 543.608L518.588 540.359C517.653 539.266 516.803 538.099 516.047 536.869L511.787 539.485ZM518.392 547.213C519.682 548.316 521.061 549.32 522.515 550.213L525.131 545.953C523.901 545.197 522.734 544.347 521.641 543.412L518.392 547.213ZM527.059 552.533C528.619 553.18 530.24 553.709 531.912 554.109L533.075 549.246C531.663 548.908 530.293 548.461 528.974 547.914L527.059 552.533ZM536.95 554.901C537.792 554.967 538.642 555 539.5 555V550C538.772 550 538.051 549.972 537.338 549.916L536.95 554.901ZM539.5 555H541.958V550H539.5V555ZM546.875 555H551.792V550H546.875V555ZM556.708 555H561.625V550H556.708V555ZM566.542 555H571.458V550H566.542V555ZM576.375 555H581.292V550H576.375V555ZM586.208 555H591.125V550H586.208V555Z"
          fill="#A283D6"
        ></path>
        <path
          d="M598.5 47L573.5 32.5662V61.4338L598.5 47ZM424.5 306H426.792V301H424.5V306ZM431.375 306H435.958V301H431.375V306ZM440.542 306H445.125V301H440.542V306ZM449.708 306H454.292V301H449.708V306ZM458.875 306H463.458V301H458.875V306ZM468.042 306H472.625V301H468.042V306ZM477.208 306H479.5V301H477.208V306ZM479.5 306C480.358 306 481.208 305.967 482.05 305.901L481.662 300.916C480.949 300.972 480.228 301 479.5 301V306ZM487.088 305.109C488.76 304.709 490.381 304.18 491.941 303.533L490.026 298.914C488.707 299.461 487.337 299.908 485.925 300.246L487.088 305.109ZM496.485 301.213C497.939 300.32 499.318 299.316 500.608 298.213L497.359 294.412C496.266 295.347 495.099 296.197 493.869 296.953L496.485 301.213ZM504.213 294.608C505.316 293.318 506.32 291.939 507.213 290.485L502.953 287.869C502.197 289.099 501.347 290.266 500.412 291.359L504.213 294.608ZM509.533 285.941C510.18 284.381 510.709 282.76 511.109 281.088L506.246 279.925C505.908 281.337 505.461 282.707 504.914 284.026L509.533 285.941ZM511.901 276.05C511.967 275.208 512 274.358 512 273.5H507C507 274.228 506.972 274.949 506.916 275.662L511.901 276.05ZM512 273.5V271.044H507V273.5H512ZM512 266.131V261.219H507V266.131H512ZM512 256.306V251.394H507V256.306H512ZM512 246.481V241.569H507V246.481H512ZM512 236.656V231.744H507V236.656H512ZM512 226.831V221.919H507V226.831H512ZM512 217.006V212.094H507V217.006H512ZM512 207.181V202.269H507V207.181H512ZM512 197.356V192.444H507V197.356H512ZM512 187.531V182.619H507V187.531H512ZM512 177.706V172.794H507V177.706H512ZM512 167.881V162.969H507V167.881H512ZM512 158.056V153.144H507V158.056H512ZM512 148.231V143.319H507V148.231H512ZM512 138.406V133.494H507V138.406H512ZM512 128.581V123.669H507V128.581H512ZM512 118.756V113.844H507V118.756H512ZM512 108.931V104.019H507V108.931H512ZM512 99.1062V94.1937H507V99.1062H512ZM512 89.2812V84.3687H507V89.2812H512ZM512 79.4562V77H507V79.4562H512ZM512 77C512 76.2718 512.028 75.5506 512.084 74.8375L507.099 74.4503C507.033 75.292 507 76.1424 507 77H512ZM512.754 70.5753C513.092 69.1627 513.539 67.7925 514.086 66.474L509.467 64.5587C508.82 66.1188 508.291 67.7403 507.891 69.4119L512.754 70.5753ZM516.047 62.6314C516.803 61.4008 517.653 60.2339 518.588 59.1408L514.787 55.8918C513.684 57.1824 512.68 58.5607 511.787 60.015L516.047 62.6314ZM521.641 56.0875C522.734 55.1531 523.901 54.303 525.131 53.5473L522.515 49.2865C521.061 50.1796 519.682 51.1837 518.392 52.287L521.641 56.0875ZM528.974 51.5857C530.293 51.039 531.663 50.5919 533.075 50.2539L531.912 45.3912C530.24 45.7911 528.619 46.3202 527.059 46.9671L528.974 51.5857ZM537.338 49.5836C538.051 49.5283 538.772 49.5 539.5 49.5V44.5C538.642 44.5 537.792 44.5333 536.95 44.5987L537.338 49.5836ZM539.5 49.5H541.958V44.5H539.5V49.5ZM546.875 49.5H551.792V44.5H546.875V49.5ZM556.708 49.5H561.625V44.5H556.708V49.5ZM566.542 49.5H571.458V44.5H566.542V49.5ZM576.375 49.5H581.292V44.5H576.375V49.5ZM586.208 49.5H591.125V44.5H586.208V49.5Z"
          fill="#A283D6"
        ></path>
        <path
          d="M700.046 0L650 28.8508V86.4983L664.294 94.7331L664.201 37.1049L699.954 16.4658L735.706 37.1049V94.71L750 86.4983V28.8006L700.046 0Z"
          fill="#A283D6"
        ></path>
        <path
          d="M707.145 94.7331L700 98.8602L692.832 94.7563V37.1049L678.538 45.3358L678.561 102.964L700 115.326L721.439 102.964V45.3358L707.145 37.1049V94.7331Z"
          fill="#A283D6"
        ></path>
        <path
          d="M741.968 173H723.876C719.463 173 715.844 176.614 715.844 181.021V204.537V272.867H723.876H741.968C746.381 272.867 750 269.253 750 264.846V181.021C750 176.614 746.381 173 741.968 173Z"
          fill="#A283D6"
        ></path>
        <path
          d="M681.579 212.421V238.702H657.895C653.564 238.702 650 242.261 650 246.586V264.983C650 269.308 653.564 272.867 657.895 272.867H715.789V204.537H689.474C685.115 204.537 681.579 208.096 681.579 212.421Z"
          fill="#4608AD"
          fill-opacity="0.25"
        ></path>
        <path
          d="M715.79 204.92V272.867H723.821H741.913C743.64 272.867 745.258 272.319 746.573 271.361C748.602 269.91 749.945 267.529 749.945 264.846V239.03L715.79 204.92Z"
          fill="#4608AD"
        ></path>
        <path
          d="M738.531 508.138C738.449 507.569 737.96 507.243 737.553 507.243C737.145 507.243 728.425 506.592 728.425 506.592C728.425 506.592 722.394 500.569 721.66 499.918C721.008 499.267 719.704 499.43 719.215 499.592C719.134 499.592 717.911 499.999 715.792 500.65C713.755 494.709 710.169 489.337 703.893 489.337C703.73 489.337 703.567 489.337 703.323 489.337C701.611 487.058 699.329 486 697.455 486C682.785 486 675.776 504.313 673.575 513.592C667.87 515.382 663.795 516.603 663.306 516.766C660.128 517.743 660.046 517.824 659.639 520.835C659.313 523.114 651 587.413 651 587.413L715.792 599.541L750.918 591.971C750.918 591.89 738.612 508.708 738.531 508.138ZM712.206 501.627C710.576 502.115 708.702 502.685 706.746 503.336C706.746 502.929 706.746 502.604 706.746 502.115C706.746 498.534 706.257 495.604 705.442 493.244C708.702 493.732 710.821 497.395 712.206 501.627ZM701.367 494.058C702.263 496.337 702.834 499.511 702.834 503.906C702.834 504.15 702.834 504.313 702.834 504.557C699.248 505.697 695.417 506.836 691.505 508.057C693.706 499.674 697.862 495.604 701.367 494.058ZM697.047 489.907C697.699 489.907 698.351 490.151 698.922 490.558C694.195 492.755 689.223 498.29 687.104 509.441C684.007 510.417 680.992 511.313 678.139 512.208C680.584 503.743 686.534 489.907 697.047 489.907Z"
          fill="#4608AD"
          fill-opacity="0.25"
        ></path>
        <path
          d="M737.553 507.162C737.145 507.162 728.425 506.511 728.425 506.511C728.425 506.511 722.394 500.488 721.661 499.836C721.416 499.592 721.09 499.43 720.764 499.43L715.874 599.541L751 591.971C751 591.971 738.694 508.708 738.612 508.138C738.449 507.569 737.96 507.243 737.553 507.162Z"
          fill="#A283D6"
        ></path>
        <path
          d="M703.893 526.533L699.574 539.393C699.574 539.393 695.743 537.358 691.098 537.358C684.252 537.358 683.926 541.672 683.926 542.73C683.926 548.59 699.248 550.869 699.248 564.624C699.248 575.449 692.402 582.448 683.111 582.448C671.945 582.448 666.322 575.53 666.322 575.53L669.337 565.682C669.337 565.682 675.205 570.728 680.095 570.728C683.355 570.728 684.659 568.205 684.659 566.333C684.659 558.682 672.108 558.357 672.108 545.741C672.108 535.16 679.688 524.905 695.091 524.905C700.959 524.824 703.893 526.533 703.893 526.533Z"
          fill="white"
        ></path>
        <path
          d="M657.1 380.933C657.1 374.742 658.45 368.85 660.8 363.457L681.3 419.482C666.95 412.541 657.1 397.911 657.1 380.933ZM728.95 378.786C728.95 382.431 727.5 386.676 725.7 392.618L721.4 406.899L705.9 360.96L710.8 360.461C713.15 360.161 712.85 356.766 710.55 356.915C710.55 356.915 703.6 357.465 699.1 357.465L687.8 356.915C685.5 356.766 685.25 360.311 687.5 360.461L692.05 360.96L698.75 379.136L689.35 407.248L673.7 360.96L678.65 360.461C680.95 360.161 680.65 356.766 678.35 356.915C678.35 356.915 671.4 357.465 666.9 357.465L664.15 357.415C671.85 345.78 685 338.091 700 338.091C711.15 338.091 721.35 342.385 728.95 349.326H728.4C724.2 349.326 721.2 352.971 721.2 356.915C721.2 360.461 723.25 363.457 725.4 366.952C727.05 369.798 728.95 373.443 728.95 378.786ZM700.75 384.678L713.95 420.73L714.25 421.33C709.8 422.927 705 423.776 700 423.776C695.8 423.776 691.75 423.177 687.9 422.029L700.75 384.678ZM737.65 360.361C741 366.503 742.9 373.443 742.9 380.933C742.9 396.712 734.3 410.544 721.55 417.934L734.65 380.134C737.1 374.043 737.95 369.149 737.95 364.805L737.65 360.361ZM700 331C706.566 331 713.068 332.292 719.134 334.801C725.2 337.31 730.712 340.988 735.355 345.625C739.998 350.262 743.681 355.767 746.194 361.825C748.707 367.883 750 374.376 750 380.933C750 394.177 744.732 406.877 735.355 416.242C725.979 425.606 713.261 430.867 700 430.867C693.434 430.867 686.932 429.575 680.866 427.066C674.8 424.557 669.288 420.878 664.645 416.242C655.268 406.877 650 394.177 650 380.933C650 367.69 655.268 354.989 664.645 345.625C674.021 336.261 686.739 331 700 331ZM700 428.57C726.3 428.57 747.7 407.198 747.7 380.933C747.7 354.668 726.3 333.297 700 333.297C673.7 333.297 652.3 354.668 652.3 380.933C652.3 407.198 673.7 428.57 700 428.57Z"
          fill="#A283D6"
        ></path>
        <rect
          x="264"
          y="259"
          width="124"
          height="98"
          rx="7"
          fill="white"
          stroke="#4608AD"
          stroke-width="6"
        ></rect>
        <path
          d="M261 266C261 260.477 265.477 256 271 256H376C381.523 256 386 260.477 386 266V281H261V266Z"
          fill="#4608AD"
          fill-opacity="0.25"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="751" height="600" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>

    <v-expansion-panels
      v-if="
        !loading &&
        !error &&
        (Object.keys(attributes).length || keywords.length)
      "
      class="mt-4"
    >
      <Attributes
        v-if="Object.keys(attributes).length"
        :hostname="attributes"
        :masked-sets="maskedSets"
        @signIn="signInDialog = true"
      />

      <v-expansion-panel v-if="keywords && keywords.length" flat>
        <v-expansion-panel-header class="subtitle-2" style="line-height: 1em">
          Keywords
        </v-expansion-panel-header>
        <v-expansion-panel-content eager>
          <v-chip-group column>
            <v-chip
              v-for="keyword in keywords"
              :key="keyword"
              :href="`${websiteUrl}/websites/${keyword}/`"
              color="accent--text"
              outlined
              label
            >
              {{ keyword }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card
      v-if="!loading && !error && technologies.length"
      class="my-4"
      style="overflow: hidden"
      tile
    >
      <v-card-title class="subtitle-2">Technologies</v-card-title>
      <div v-for="category in categorised" :key="category.slug" class="mb-4">
        <v-divider />

        <v-card-title class="subtitle-2">
          {{ category.name }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-simple-table>
            <tbody>
              <tr
                v-for="{ name, slug, icon } in category.technologies"
                :key="name"
              >
                <td>
                  <a
                    :href="`${websiteUrl}/technologies/${category.slug}/${slug}/?utm_source=lookup&utm_medium=twa&utm_campaign=wappalyzer`"
                    target="_blank"
                    class="d-flex align-center body-2 my-2"
                  >
                    <TechnologyIcon :base-url="websiteUrl" :icon="icon" />
                    {{ name }}
                  </a>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </div>
    </v-card>

    <v-card v-if="isSignedIn && !isLoading && !credits" tile>
      <v-card-title class="subtitle-2">No credits remaining</v-card-title>
      <v-card-text class="pb-0">
        Please top-up your credit balance.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :href="`${websiteUrl}/credits/`"
          color="accent"
          target="_blank"
          text
          >Buy credits</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signInDialog"
      max-width="400px"
    >
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify, mdiLayersOutline } from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Attributes from '~/components/Attributes.vue'
import Progress from '~/components/Progress.vue'
import SignIn from '~/components/SignIn.vue'

function getFullUrl(url = '') {
  let fullUrl = url.trim()

  try {
    if (!/[^.]\.[a-z]{2,}/i.test(url)) {
      throw new Error('Invalid URL')
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = `http://${fullUrl}`
    }

    const { hostname } = new URL(fullUrl) // eslint-disable-line no-new

    if (/^(?:[\d.]+|(?:[a-f0-9:]+:+)+[a-f0-9]+|localhost)$/.test(hostname)) {
      throw new Error('Invalid URL')
    }
  } catch (error) {
    return ''
  }

  return fullUrl
}

export default {
  components: {
    TechnologyIcon,
    Attributes,
    SignIn,
    Progress,
  },
  data() {
    return {
      url: '',
      error: null,
      mdiMagnify,
      mdiLayersOutline,
      urlRules: [(v) => !v || !!getFullUrl(v) || 'Please enter a valid URL'],
      loading: false,
      attributes: {},
      technologies: [],
      keywords: [],
      maskedSets: [],
      valid: false,
      websiteUrl: this.$config.WEBSITE_URL,
      signInDialog: false,
    }
  },
  computed: {
    ...mapState({
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
    categorised() {
      return Object.values(
        this.technologies.reduce((categories, technology) => {
          technology.categories.forEach((category) => {
            categories[category.slug] = categories[category.slug] || {
              ...category,
              technologies: [],
            }

            categories[category.slug].technologies.push(technology)
          })

          return categories
        }, {})
      )
    },
  },
  watch: {
    async isLoading() {
      if (!this.isLoading) {
        const { url, title, text } = this.$route.query

        const textMatch = (text || '').match(/http[^\s]+/) || []
        const titleMatch = (title || '').match(/http[^\s]+/) || []

        this.url = url || textMatch[0] || titleMatch[0] || this.url

        if (this.$refs.url) {
          this.$refs.url.focus()
        }

        if (this.url) {
          this.lastUrl = null

          await this.submit()
        }
      }
    },
  },
  methods: {
    async submit() {
      const url = getFullUrl(this.url)

      if (!url || (url === this.lastUrl && this.technologies.length)) {
        return
      }

      this.url = url

      const { hostname } = new URL(url) // eslint-disable-line no-new

      if (
        [
          'wappalyzer',
          'google',
          'facebook',
          'twitter',
          'reddit',
          'yahoo',
          'wikipedia',
          'amazon',
          'youtube',
        ].some((ignore) => hostname.includes(ignore))
      ) {
        this.error =
          'This website is excluded from lookups for technical reasons. Please use our free browser extension instead.'

        return
      }

      this.lastUrl = url

      this.error = false

      if (this.isSignedIn && !this.credits) {
        this.error = 'Insufficient credits.'

        return
      }

      this.technologies = []
      this.attributes = {}
      this.keywords = []

      this.loading = true

      let credits

      try {
        if (this.isSignedIn) {
          ;({
            maskedSets: this.maskedSets,
            credits,
            technologies: this.technologies,
            attributes: this.attributes,
            keywords: this.keywords,
          } = (
            await this.$axios(`lookup-site/${encodeURIComponent(url)}`)
          ).data)

          this.$store.commit('credits/setCredits', credits)
        } else {
          try {
            ;({
              maskedSets: this.maskedSets,
              technologies: this.technologies,
              attributes: this.attributes,
              keywords: this.keywords,
            } = (
              await this.$axios(`lookup-site/public/${encodeURIComponent(url)}`)
            ).data)
          } catch (error) {
            if (error.response && error.response.status === 401) {
              this.signInDialog = true
              this.loading = false

              return
            }

            throw error
          }
        }
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data)) ||
          this.getErrorMessage(error)
      }

      this.technologies = this.technologies || []
      this.attributes = this.attributes || {}
      this.keywords = this.keywords || []

      this.loading = false
    },
  },
}
</script>
