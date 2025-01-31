//         ___ _            _
//        / __(_)_ __  _ __| |___
//        \__ \ | '  \| '_ \ / -_)
//    ___ |___/_|_|_|_| .__/_\___| _   _  __
//   / __| |__ _ __| ||_|| \| |___| |_(_)/ _|_  _
//   \__ \ / _` / _| / / | .` / _ \  _| |  _| || |
//   |___/_\__,_\__|_\_\ |_|\_\___/\__|_|_|  \_, |
//  Slack notification action that just works |__/
// Copyright 2020 Adam K Dean <adamkdean@googlemail.com>

const core = require('@actions/core')
const { IncomingWebhook } = require('@slack/webhook')

try {  
/* eslint-disable no-eval */
  const disableEval = !!core.getInput('disable_eval')
  const env = process.env // eslint-disable-line
  const envsubst = (str) => (disableEval ? str : eval(`\`${str}\``))

  const webhookUrl = envsubst(core.getInput('webhook_url'));

  const slack = new IncomingWebhook(webhookUrl || process.env.SLACK_WEBHOOK_URL)



  const channel = envsubst(core.getInput('channel'))
  const username = envsubst(core.getInput('username'))
  const status = envsubst(core.getInput('status'))
  const successText = envsubst(core.getInput('success_text'))
  const failureText = envsubst(core.getInput('failure_text'))
  const cancelledText = envsubst(core.getInput('cancelled_text'))
  const fields = JSON.parse(envsubst(core.getInput('fields')) || '[]')
  const authorName = envsubst(core.getInput('author_name'))
  const authorLink = envsubst(core.getInput('author_link'))
  const authorIcon = envsubst(core.getInput('author_icon'))

  let color = envsubst(core.getInput('color'))
  let text = envsubst(core.getInput('text'))

  // If color isn't set but status is, infer the color
  if (!color) {
    if (status === 'success') {
      color = 'good'
    } else if (status === 'failure') {
      color = 'danger'
    } else if (status === 'cancelled') {
      color = 'warning'
    }
  }
  // If text isn't set, check for status specific text
  if (!text) {
    if (status === 'success') {
      text = successText || 'No success text specified.'
    } else if (status === 'failure') {
      text = failureText || 'No failure text specified.'
    } else if (status === 'cancelled') {
      text = cancelledText || 'No cancelled text specified.'
    }
  }

  // Send the notification
  ;(async () => {
    await slack.send({
      channel,
      username,
      attachments: [
        {
          fallback: text,
          author_name: authorName,
          author_link: authorLink,
          author_icon: authorIcon,
          text,
          color,
          fields
        }
      ]
    })
  })()
} catch (error) {
  core.setFailed(error.message)
}
