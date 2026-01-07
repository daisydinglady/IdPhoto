const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/hivision');

class HivisionService {
  constructor() {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.endpoints = config.endpoints;
  }

  /**
   * 生成证件照（抠图 + 裁切 + 透明底）
   */
  async generateIdphoto(imageBuffer, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.jpg',
        contentType: 'image/jpeg'
      });

      // 合并默认参数
      const params = {
        height: options.height || 413,
        width: options.width || 295,
        human_matting_model: options.human_matting_model || 'modnet_photographic_portrait_matting',
        face_detect_model: options.face_detect_model || 'mtcnn',
        hd: options.hd !== undefined ? options.hd : config.defaults.hd,
        dpi: options.dpi || config.defaults.dpi,
        face_alignment: options.face_alignment !== undefined ? options.face_alignment : config.defaults.faceAlignment,
        head_measure_ratio: options.head_measure_ratio || config.defaults.headMeasureRatio,
        head_height_ratio: options.head_height_ratio || config.defaults.headHeightRatio,
        top_distance_max: options.top_distance_max || config.defaults.topDistanceMax,
        top_distance_min: options.top_distance_min || config.defaults.topDistanceMin,
        brightness_strength: options.brightness_strength || config.defaults.brightnessStrength,
        contrast_strength: options.contrast_strength || config.defaults.contrastStrength,
        sharpen_strength: options.sharpen_strength || config.defaults.sharpenStrength,
        saturation_strength: options.saturation_strength || config.defaults.saturationStrength
      };

      Object.keys(params).forEach(key => {
        formData.append(key, params[key].toString());
      });

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.idphoto}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }

  /**
   * 添加背景色
   */
  async addBackground(imageBuffer, color, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.png',
        contentType: 'image/png'
      });

      formData.append('color', color || '4A90E2');
      formData.append('render', options.render || 0);
      formData.append('dpi', options.dpi || config.defaults.dpi);

      if (options.kb) {
        formData.append('kb', options.kb.toString());
      }

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.addBackground}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }

  /**
   * 生成六寸排版照
   */
  async generateLayout(imageBuffer, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.jpg',
        contentType: 'image/jpeg'
      });

      formData.append('height', options.height?.toString() || '413');
      formData.append('width', options.width?.toString() || '295');
      formData.append('dpi', options.dpi?.toString() || config.defaults.dpi.toString());

      if (options.kb) {
        formData.append('kb', options.kb.toString());
      }

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.generateLayout}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }

  /**
   * 证件照裁切
   */
  async cropIdphoto(imageBuffer, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.png',
        contentType: 'image/png'
      });

      formData.append('height', options.height?.toString() || '413');
      formData.append('width', options.width?.toString() || '295');
      formData.append('face_detect_model', options.face_detect_model || 'mtcnn');
      formData.append('hd', options.hd !== undefined ? options.hd.toString() : 'true');
      formData.append('dpi', options.dpi?.toString() || config.defaults.dpi.toString());
      formData.append('head_measure_ratio', options.head_measure_ratio?.toString() || config.defaults.headMeasureRatio.toString());
      formData.append('head_height_ratio', options.head_height_ratio?.toString() || config.defaults.headHeightRatio.toString());
      formData.append('top_distance_max', options.top_distance_max?.toString() || config.defaults.topDistanceMax.toString());
      formData.append('top_distance_min', options.top_distance_min?.toString() || config.defaults.topDistanceMin.toString());

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.idphotoCrop}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }

  /**
   * 调整 KB 大小
   */
  async setKB(imageBuffer, kb, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.jpg',
        contentType: 'image/jpeg'
      });

      formData.append('kb', kb.toString());
      formData.append('dpi', options.dpi?.toString() || config.defaults.dpi.toString());

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.setKB}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }

  /**
   * 人像抠图
   */
  async humanMatting(imageBuffer, options = {}) {
    try {
      const formData = new FormData();
      formData.append('input_image', imageBuffer, {
        filename: 'photo.jpg',
        contentType: 'image/jpeg'
      });

      formData.append('human_matting_model', options.human_matting_model || 'modnet_photographic_portrait_matting');
      formData.append('dpi', options.dpi?.toString() || config.defaults.dpi.toString());

      const response = await axios.post(
        `${this.baseURL}${this.endpoints.humanMatting}`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Hivision API Error: ${error.message}`);
    }
  }
}

module.exports = new HivisionService();
