<div class="user-main__profile-settings">
  <div class="user-main__profile-settings-name">
    <label
      class="user-main__profile-settings-name-label"
      for="full_name"
    >Full Name
    </label>
    <input
      class="user-main__profile-settings-name-input"
      type="text"
      id="full_name"
      name="full_name"
      placeholder="Your Name"
    />
  </div>
  <div class="user-main__profile-settings-nickname">
    <label
      class="user-main__profile-settings-nickname-label"
      for="nickname"
    >Nick Name
    </label>
    <input
      class="user-main__profile-settings-nickname-input"
      type="text"
      id="nickname"
      name="nickname"
      placeholder="Your Nickname"
    />
  </div>
  <div class="user-main__profile-settings-gender">
    <label
      class="user-main__profile-settings-gender-label"
      for="gender"
    >Gender
    </label>
    <select
      class="user-main__profile-settings-gender-select"
      name="gender"
      id="gender"
    >
      <option
        class="user-main__profile-settings-gender-option"
        value=""
      >Select your gender
      </option>
      <option
        class="user-main__profile-settings-gender-option"
        value="Men"
      >Men
      </option>
      <option
        class="user-main__profile-settings-gender-option"
        value="Woman"
      >Woman
      </option>
    </select>
  </div>
  <div class="user-main__profile-settings-country">
    <label
      for="country"
      class="user-main__profile-settings-country-label"
    >Country
    </label>
    <select
      id="country"
      name="country"
      class="user-main__profile-settings-country-select"
    >
      <option value="">Select your country</option>
      @foreach(config('countries') as $code => $name)
        <option value="{{ $code }}">{{ $name }}</option>
      @endforeach
    </select>
  </div>
</div> 