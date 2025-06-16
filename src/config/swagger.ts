import swaggerJsdoc from 'swagger-jsdoc';
import config from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web Novel Game API',
      version: '1.0.0',
      description:
        'API for an interactive web novel game, powered by AI. This API manages users, game sessions, and interacts with an AI service to generate story content.',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Option: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'cuid',
              description: 'The unique identifier for the option.',
            },
            name: {
              type: 'string',
              description: 'The display name of the option.',
            },
          },
          example: {
            id: 'clw9h3j1z0000a4b8c2d6e8f4',
            name: 'Fantasy',
          },
        },
        CurrentChoice: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The text of the choice available to the player.'
                }
            },
            example: {
                text: 'Explore the dark cave.'
            }
        },
        // Schema cho một đoạn truyện
        StorySegment: {
          type: 'object',
          discriminator: {
            propertyName: 'type'
          },
          properties: {
            type: {
              type: 'string',
              enum: ['text', 'choice'],
            },
            content: {
              type: 'string',
              description: 'Content for a text segment.'
            },
            choiceText: {
                type: 'string',
                description: 'Content for a choice segment.'
            }
          },
        },
        // Schema cho một Session đầy đủ (đã được cập nhật để dùng $ref)
        SessionDetail: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            title: { type: 'string', example: 'Mối tình đầu dưới mái trường' },
            status: { type: 'string', example: 'in_progress' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            genre: { $ref: '#/components/schemas/Option' }, // <-- Bây giờ sẽ hoạt động
            setting: { $ref: '#/components/schemas/Option' }, // <-- Bây giờ sẽ hoạt động
            story: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StorySegment',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/api/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;