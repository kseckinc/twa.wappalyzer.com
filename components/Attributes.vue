<template>
  <div style="width: 100%">
    <v-expansion-panel v-for="(set, setKey) in attributes" :key="setKey" flat>
      <v-expansion-panel-header class="subtitle-2" style="line-height: 1em"
        >{{ set.title }}

        <span class="body-2 my-n2">
          <v-chip
            v-if="['contact', 'company', 'social'].includes(setKey)"
            color="primary"
            class="ml-2"
            x-small
            outlined
          >
            PRO</v-chip
          >
        </span>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="nopadding" eager>
        <Pro v-if="maskedSets.includes(setKey)" class="mb-4" />

        <v-simple-table>
          <tbody>
            <tr
              v-for="(attribute, attributeKey) in set.attributes"
              :key="attributeKey"
            >
              <th class="pl-6" width="30%">
                {{ attribute.title }}
              </th>
              <td class="px-6">
                <v-chip-group
                  v-if="
                    ['email', 'phone'].includes(attributeKey) ||
                    setKey === 'social'
                  "
                  column
                >
                  <div v-for="(value, index) in attribute.values" :key="index">
                    <v-chip
                      v-if="attributeKey === 'email'"
                      :href="
                        maskedSets.includes(setKey)
                          ? ''
                          : `mailto:${value.text}`
                      "
                      color="accent--text"
                      outlined
                      label
                    >
                      <v-icon small left>
                        {{ mdiEmail }}
                      </v-icon>
                      <span
                        :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >
                        {{ value.text }}
                      </span>
                    </v-chip>
                    <v-chip
                      v-else-if="attributeKey === 'phone'"
                      :href="
                        maskedSets.includes(setKey) ? '' : `tel:${value.text}`
                      "
                      color="accent--text"
                      outlined
                      label
                    >
                      <v-icon small left>
                        {{ mdiPhone }}
                      </v-icon>
                      <span
                        :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >
                        {{ value.text }}
                      </span>
                    </v-chip>
                    <v-chip
                      v-else-if="value.to"
                      :href="maskedSets.includes(setKey) ? '' : value.to"
                      rel="nofollow noopener"
                      target="_blank"
                      color="accent--text"
                      outlined
                      label
                    >
                      <v-icon
                        v-if="
                          [
                            'twitter',
                            'instagram',
                            'facebook',
                            'linkedin',
                            'youtube',
                            'github',
                            'pinterest',
                          ].includes(attributeKey)
                        "
                        small
                        left
                      >
                        {{ mdi[attributeKey] }}
                      </v-icon>
                      <span
                        :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >
                        {{ value.text }}
                      </span></v-chip
                    >
                  </div>
                </v-chip-group>
                <template v-else>
                  <div v-for="(value, index) in attribute.values" :key="index">
                    <v-icon v-if="value.text === true" color="success" small>{{
                      mdiCheck
                    }}</v-icon>
                    <v-icon
                      v-else-if="value.text === false"
                      color="error"
                      small
                      >{{ mdiClose }}</v-icon
                    >
                    <div
                      v-else-if="attributeKey === 'employees'"
                      :class="`${
                        maskedSets.includes(setKey) ? 'blurred ' : ''
                      }my-2`"
                    >
                      <v-divider v-if="index" class="my-2" />

                      <span class="font-weight-medium">{{
                        value.text.split(' -- ').shift()
                      }}</span
                      ><br />
                      <small
                        v-if="value.text.split(' -- ').pop().length >= 3"
                        >{{ value.text.split(' -- ').pop() }}</small
                      >
                    </div>
                    <div
                      v-else-if="attributeKey === 'companyName'"
                      :class="`${
                        maskedSets.includes(setKey) ? 'blurred ' : ''
                      }my-2`"
                    >
                      <strong>{{ value.text }}</strong>
                    </div>
                    <div
                      v-else
                      :class="`${
                        maskedSets.includes(setKey) && setKey === 'company'
                          ? 'blurred '
                          : ''
                      }my-2`"
                    >
                      {{ value.text }}
                    </div>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import {
  mdiCheck,
  mdiClose,
  mdiTwitter,
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiPhone,
  mdiEmail,
  mdiYoutube,
  mdiGithub,
  mdiPinterest,
} from '@mdi/js'

import Pro from '~/components/Pro.vue'

export default {
  components: {
    Pro,
  },
  props: {
    hostname: {
      type: Object,
      default() {
        return {}
      },
    },
    maskedSets: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mdiCheck,
      mdiClose,
      mdiPhone,
      mdiEmail,
      mdi: {
        twitter: mdiTwitter,
        facebook: mdiFacebook,
        instagram: mdiInstagram,
        linkedin: mdiLinkedin,
        youtube: mdiYoutube,
        github: mdiGithub,
        pinterest: mdiPinterest,
      },
    }
  },
  computed: {
    attributes() {
      return this.transformAttributes(
        ['contact', 'company', 'social', 'meta', 'locale'],
        this.hostname
      )
    },
  },
}
</script>

<style>
.nopadding .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}

.blurred {
  filter: blur(3px);
}
</style>
