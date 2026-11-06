---
title: Internal LLM chatbot at Mastercard
summary: Backend design for an internal chatbot, from enterprise data ingestion to streamed responses.
role: Backend design lead
draft: true
---

## Problem

Giving internal users a chatbot that could answer from enterprise knowledge.

## Constraints

TODO(Rob): add what you can share publicly. Check with Mastercard before publishing anything about this system.

## Architecture

- An enterprise data ingestion pipeline feeding a hosted LLM
- Knowledge processed into the model's context rather than retrieved on demand
- Responses streamed back to the client

## Decisions

Kept the ingestion layer and the LLM provider independently swappable.

TODO(Rob): add the other key choices and their trade-offs.

## Outcome

TODO(Rob): add results you are allowed to share.
